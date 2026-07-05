import { GITHUB_REPOS, OWNER } from "./constants";
import { redis } from "./redis";
import type { GitHubRepo, GitHubStats, ContributionGraph } from "@/types";

interface RawGitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  topics?: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  private: boolean;
  fork: boolean;
  default_branch: string;
}

interface GraphQLPinnedRepoNode {
  name: string;
  description: string | null;
  url: string;
  homepageUrl: string | null;
  primaryLanguage: { name: string } | null;
  stargazerCount: number;
  forkCount: number;
  repositoryTopics?: { nodes: Array<{ topic: { name: string } }> };
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  isPrivate: boolean;
  isFork: boolean;
  defaultBranchRef?: { name: string } | null;
}

interface GraphQLContributionDay {
  date: string;
  contributionCount: number;
  color: string;
}

interface GraphQLContributionWeek {
  contributionDays: GraphQLContributionDay[];
}

const GITHUB_USERNAME = process.env.GITHUB_USERNAME || OWNER.username;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Cache TTL: 1 hour
const CACHE_TTL = 3600;

/**
 * Fetch with timeout helper
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 5000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

/**
 * Get cached item or fetch and cache it
 */
async function getCachedOrFetch<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
  const cacheKey = `github:${key}`;
  
  if (redis) {
    try {
      const cached = await redis.get<string>(cacheKey);
      if (cached) {
        console.log(`Cache hit for ${cacheKey}`);
        return typeof cached === "string" ? JSON.parse(cached) : cached;
      }
    } catch (err) {
      console.warn(`Redis get failed for ${cacheKey}, proceeding to fetch:`, err);
    }
  }

  const freshData = await fetchFn();

  if (redis) {
    try {
      await redis.set(cacheKey, JSON.stringify(freshData), { ex: CACHE_TTL });
    } catch (err) {
      console.warn(`Redis set failed for ${cacheKey}:`, err);
    }
  }

  return freshData;
}

/**
 * Fetch GitHub user profile and stats
 */
export async function getGitHubStats(): Promise<GitHubStats> {
  return getCachedOrFetch<GitHubStats>("stats", async () => {
    if (!GITHUB_TOKEN) {
      console.log("No GITHUB_TOKEN found, returning static fallback stats.");
      return getStaticFallbackStats();
    }

    try {
      // 1. Fetch User Profile
      const userRes = await fetchWithTimeout(
        `https://api.github.com/users/${GITHUB_USERNAME}`,
        {
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github+json",
          },
        }
      );

      if (!userRes.ok) {
        throw new Error(`GitHub Profile API returned ${userRes.status}`);
      }

      const userData = await userRes.json();

      // 2. Fetch all public repos to calculate stars, forks, languages
      let allRepos: RawGitHubRepo[] = [];
      let page = 1;
      let hasMore = true;

      while (hasMore && page <= 5) { // Cap at 5 pages (150 repos)
        const reposRes = await fetchWithTimeout(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=30&page=${page}&type=owner`,
          {
            headers: {
              Authorization: `Bearer ${GITHUB_TOKEN}`,
              Accept: "application/vnd.github+json",
            },
          }
        );

        if (!reposRes.ok) break;
        const reposData = await reposRes.json();
        if (reposData.length === 0) {
          hasMore = false;
        } else {
          allRepos = [...allRepos, ...reposData];
          page++;
        }
      }

      let totalStars = 0;
      let totalForks = 0;
      const languages: Record<string, number> = {};

      allRepos.forEach((repo) => {
        totalStars += repo.stargazers_count || 0;
        totalForks += repo.forks_count || 0;
        if (repo.language) {
          languages[repo.language] = (languages[repo.language] || 0) + 1;
        }
      });

      // Sort languages by count
      const sortedLanguages = Object.entries(languages)
        .sort((a, b) => b[1] - a[1])
        .reduce((acc, [key, val]) => ({ ...acc, [key]: val }), {});

      // 3. Fetch Pinned Repos (or fallback to top repos by stars)
      const pinned = await getPinnedRepos(allRepos);

      // 4. Fetch contribution calendar
      const contributionGraph = await getContributions();

      return {
        user: {
          login: userData.login,
          name: userData.name || userData.login,
          bio: userData.bio || "",
          avatarUrl: userData.avatar_url,
          htmlUrl: userData.html_url,
          publicRepos: userData.public_repos,
          publicGists: userData.public_gists,
          followers: userData.followers,
          following: userData.following,
          createdAt: userData.created_at,
          location: userData.location || "",
          blog: userData.blog || "",
          company: userData.company || "",
        },
        totalStars,
        totalForks,
        totalRepos: userData.public_repos,
        topLanguages: sortedLanguages,
        contributionsLastYear: contributionGraph.totalContributions,
        contributionGraph,
        pinnedRepos: pinned,
        fetchedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error fetching live GitHub stats, falling back to static:", error);
      return getStaticFallbackStats();
    }
  });
}

/**
 * Get pinned repos or fall back to sorting by stars
 */
async function getPinnedRepos(allRepos: RawGitHubRepo[]): Promise<GitHubRepo[]> {
  try {
    // Attempt to query GraphQL for pinned items
    const query = `
      query($username: String!) {
        user(login: $username) {
          pinnedItems(first: 6, types: REPOSITORY) {
            nodes {
              ... on Repository {
                name
                description
                url
                homepageUrl
                primaryLanguage {
                  name
                }
                stargazerCount
                forkCount
                repositoryTopics(first: 10) {
                  nodes {
                    topic {
                      name
                    }
                  }
                }
                createdAt
                updatedAt
                pushedAt
                isPrivate
                isFork
                defaultBranchRef {
                  name
                }
              }
            }
          }
        }
      }
    `;

    const graphqlRes = await fetchWithTimeout("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { username: GITHUB_USERNAME },
      }),
    });

    if (graphqlRes.ok) {
      const result = await graphqlRes.json();
      const nodes = result.data?.user?.pinnedItems?.nodes;
      if (nodes && nodes.length > 0) {
        return nodes.map((node: GraphQLPinnedRepoNode, idx: number) => ({
          id: idx,
          name: node.name,
          fullName: `${GITHUB_USERNAME}/${node.name}`,
          description: node.description || "",
          htmlUrl: node.url,
          homepage: node.homepageUrl || "",
          language: node.primaryLanguage?.name || "",
          stargazersCount: node.stargazerCount || 0,
          forksCount: node.forkCount || 0,
          watchersCount: 0,
          openIssuesCount: 0,
          topics: node.repositoryTopics?.nodes?.map((n) => n.topic.name) || [],
          createdAt: node.createdAt,
          updatedAt: node.updatedAt,
          pushedAt: node.pushedAt,
          isPrivate: node.isPrivate,
          isFork: node.isFork,
          defaultBranch: node.defaultBranchRef?.name || "main",
        }));
      }
    }
  } catch (err) {
    console.error("GraphQL Pinned Repos failed, falling back to star sorting:", err);
  }

  // Fallback to top starred repos from the public list
  const sorted = [...allRepos]
    .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
    .slice(0, 6);

  return sorted.map((repo) => ({
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description || "",
    htmlUrl: repo.html_url,
    homepage: repo.homepage || "",
    language: repo.language || "",
    stargazersCount: repo.stargazers_count || 0,
    forksCount: repo.forks_count || 0,
    watchersCount: repo.watchers_count || 0,
    openIssuesCount: repo.open_issues_count || 0,
    topics: repo.topics || [],
    createdAt: repo.created_at,
    updatedAt: repo.updated_at,
    pushedAt: repo.pushed_at,
    isPrivate: repo.private || false,
    isFork: repo.fork || false,
    defaultBranch: repo.default_branch || "main",
  }));
}

/**
 * Fetch user repositories directly
 */
export async function getRepositories(): Promise<GitHubRepo[]> {
  return getCachedOrFetch<GitHubRepo[]>("repos", async () => {
    if (!GITHUB_TOKEN) return GITHUB_REPOS;

    try {
      const res = await fetchWithTimeout(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=12`,
        {
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github+json",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch repos");
      const data: RawGitHubRepo[] = await res.json();
      return data.map((repo) => ({
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description || "",
        htmlUrl: repo.html_url,
        homepage: repo.homepage || "",
        language: repo.language || "",
        stargazersCount: repo.stargazers_count || 0,
        forksCount: repo.forks_count || 0,
        watchersCount: repo.watchers_count || 0,
        openIssuesCount: repo.open_issues_count || 0,
        topics: repo.topics || [],
        createdAt: repo.created_at,
        updatedAt: repo.updated_at,
        pushedAt: repo.pushed_at,
        isPrivate: repo.private || false,
        isFork: repo.fork || false,
        defaultBranch: repo.default_branch || "main",
      }));
    } catch (err) {
      console.error("Error fetching live repos, returning fallback:", err);
      return GITHUB_REPOS;
    }
  });
}

/**
 * Fetch GitHub Contribution calendar
 */
export async function getContributions(): Promise<ContributionGraph> {
  return getCachedOrFetch<ContributionGraph>("contributions", async () => {
    const emptyGraph: ContributionGraph = { weeks: [], totalContributions: 0 };
    if (!GITHUB_TOKEN) return emptyGraph;

    try {
      const query = `
        query($username: String!) {
          user(login: $username) {
            contributionsCollection {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    date
                    contributionCount
                    color
                  }
                }
              }
            }
          }
        }
      `;

      const res = await fetchWithTimeout("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          variables: { username: GITHUB_USERNAME },
        }),
      });

      if (!res.ok) throw new Error("GraphQL calendar failed");

      const result = await res.json();
      const calendar = result.data?.user?.contributionsCollection?.contributionCalendar;

      if (!calendar) return emptyGraph;

      return {
        totalContributions: calendar.totalContributions || 0,
        weeks: calendar.weeks.map((week: GraphQLContributionWeek) => ({
          days: week.contributionDays.map((day: GraphQLContributionDay) => {
            // Map color levels 0-4
            let level: 0 | 1 | 2 | 3 | 4 = 0;
            if (day.contributionCount > 0) {
              if (day.contributionCount < 3) level = 1;
              else if (day.contributionCount < 6) level = 2;
              else if (day.contributionCount < 9) level = 3;
              else level = 4;
            }
            return {
              date: day.date,
              count: day.contributionCount,
              level,
            };
          }),
        })),
      };
    } catch (err) {
      console.error("Error fetching contribution calendar:", err);
      return emptyGraph;
    }
  });
}

/**
 * Generate static stats as fallback
 */
function getStaticFallbackStats(): GitHubStats {
  const langCount: Record<string, number> = {};
  GITHUB_REPOS.forEach((r) => {
    if (r.language) {
      langCount[r.language] = (langCount[r.language] || 0) + 1;
    }
  });

  return {
    user: {
      login: OWNER.username,
      name: OWNER.name,
      bio: OWNER.bio,
      avatarUrl: OWNER.avatarUrl,
      htmlUrl: `https://github.com/${OWNER.username}`,
      publicRepos: GITHUB_REPOS.length,
      publicGists: 0,
      followers: 12,
      following: 15,
      createdAt: "2023-01-01T00:00:00Z",
    },
    totalStars: 5,
    totalForks: 2,
    totalRepos: GITHUB_REPOS.length,
    topLanguages: langCount,
    pinnedRepos: GITHUB_REPOS,
    fetchedAt: new Date().toISOString(),
  };
}
