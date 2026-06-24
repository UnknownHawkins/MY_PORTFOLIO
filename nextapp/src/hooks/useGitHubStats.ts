import { useQuery } from "@tanstack/react-query";
import type { GitHubStats, GitHubRepo } from "@/types";

async function fetchStats(): Promise<GitHubStats> {
  const res = await fetch("/api/github/stats");
  if (!res.ok) {
    throw new Error("Failed to fetch GitHub stats");
  }
  const payload = await res.json();
  if (!payload.success) {
    throw new Error(payload.error || "GitHub stats fetch failed");
  }
  return payload.data;
}

async function fetchRepos(): Promise<GitHubRepo[]> {
  const res = await fetch("/api/github/repos");
  if (!res.ok) {
    throw new Error("Failed to fetch GitHub repos");
  }
  const payload = await res.json();
  if (!payload.success) {
    throw new Error(payload.error || "GitHub repos fetch failed");
  }
  return payload.data;
}

export function useGitHubStats() {
  return useQuery<GitHubStats, Error>({
    queryKey: ["github", "stats"],
    queryFn: fetchStats,
    staleTime: 1000 * 60 * 30, // 30 minutes stale time on client
    retry: 1,
  });
}

export function useGitHubRepos() {
  return useQuery<GitHubRepo[], Error>({
    queryKey: ["github", "repos"],
    queryFn: fetchRepos,
    staleTime: 1000 * 60 * 30, // 30 minutes stale time on client
    retry: 1,
  });
}
