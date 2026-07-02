import { NextRequest, NextResponse } from "next/server";
import { createRateLimiter } from "@/lib/redis";
import prisma from "@/lib/db";
import { getGitHubStats, getRepositories } from "@/lib/github";
import {
  OWNER,
  CONTACT_INFO,
  SKILLS,
  EDUCATION,
  CERTIFICATIONS,
  PROJECTS,
  EXPERIENCE,
  BLOGS,
} from "@/lib/constants";
import type { Skill, Project, Blog, Education as EducationModel, Experience as ExperienceModel, Certification } from "@/types";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// ── Web search utility using DuckDuckGo HTML scraper ─────────────────────────
async function searchDuckDuckGo(query: string) {
  try {
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });
    if (!response.ok) {
      throw new Error(`DDG returned status ${response.status}`);
    }
    const html = await response.text();
    const results = [];
    const resultBlocks = html.split('class="result results_links results_links_deep web-result ');

    for (let i = 1; i < resultBlocks.length && i <= 5; i++) {
      const block = resultBlocks[i];

      const linkMatch =
        block.match(/<a\s+[^>]*href="([^"]+)"[^>]*class="result__a"[^>]*>([\s\S]*?)<\/a>/i) ||
        block.match(/<a\s+[^>]*class="result__a"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i);

      const snippetMatch =
        block.match(/<a\s+[^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/a>/i) ||
        block.match(/<a\s+[^>]*href="([^"]+)"[^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/a>/i);

      if (linkMatch) {
        let rawUrl = linkMatch[1];
        let url = rawUrl;
        if (url.startsWith("//")) {
          url = "https:" + url;
        }
        if (url.includes("uddg=")) {
          const parts = url.split("uddg=");
          url = decodeURIComponent(parts[1].split("&")[0]);
        }

        const title = linkMatch[2].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
        const snippet = snippetMatch
          ? snippetMatch[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
          : "";

        results.push({ title, url, snippet });
      }
    }
    return results;
  } catch (err) {
    console.error("DuckDuckGo search scraper failed:", err);
    return [];
  }
}

// ── Dynamic Portfolio Knowledge Loader ────────────────────────────────────────
async function loadFullPortfolioKnowledge() {
  let activeSkills: Skill[] = SKILLS;
  let activeProjects: Project[] = PROJECTS;
  let activeBlogs: Blog[] = BLOGS;
  let activeEducation: EducationModel[] = EDUCATION;
  let activeExperience: ExperienceModel[] = EXPERIENCE;
  let activeCertifications: Certification[] = CERTIFICATIONS;

  // 1. Load database items if available
  if (process.env.TURSO_DATABASE_URL) {
    try {
      const [dbSkills, dbProjects, dbBlogs, dbEdu, dbExp, dbCerts] = await Promise.all([
        prisma.skill.findMany({ orderBy: { order: "asc" } }),
        prisma.project.findMany({ orderBy: { order: "asc" } }),
        prisma.blog.findMany({ orderBy: { updatedAt: "desc" } }),
        prisma.education.findMany({ orderBy: { endYear: "desc" } }),
        prisma.experience.findMany({ orderBy: { startDate: "desc" } }),
        prisma.certification.findMany({ orderBy: { year: "desc" } }),
      ]);

      if (dbSkills.length > 0) activeSkills = dbSkills as unknown as Skill[];
      if (dbProjects.length > 0) activeProjects = dbProjects as unknown as Project[];
      if (dbBlogs.length > 0) activeBlogs = dbBlogs as unknown as Blog[];
      if (dbEdu.length > 0) activeEducation = dbEdu as unknown as EducationModel[];
      if (dbExp.length > 0) activeExperience = dbExp as unknown as ExperienceModel[];
      if (dbCerts.length > 0) activeCertifications = dbCerts as unknown as Certification[];
    } catch (err) {
      console.error("Friday knowledge loader DB query warning:", err);
    }
  }

  // 2. Fetch real-time GitHub repository & profile data using GitHub API / Token
  let githubStats = null;
  let githubRepos: any[] = [];
  try {
    const [statsResult, reposResult] = await Promise.all([
      getGitHubStats().catch(() => null),
      getRepositories().catch(() => []),
    ]);
    githubStats = statsResult;
    githubRepos = reposResult || [];
  } catch (ghErr) {
    console.error("Friday GitHub real-time fetch error:", ghErr);
  }

  return {
    skills: activeSkills,
    projects: activeProjects,
    blogs: activeBlogs,
    education: activeEducation,
    experience: activeExperience,
    certifications: activeCertifications,
    githubStats,
    githubRepos,
  };
}

export async function POST(req: NextRequest) {
  let requestBody: any = null;
  try {
    // 1. Apply rate limiting
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";

    const limiter = createRateLimiter(15, 60);
    const { success } = await limiter.limit(`friday:${ip}`);
    if (!success) {
      return NextResponse.json(
        { success: false, error: "Too many AI requests. Please wait a moment." },
        { status: 429 }
      );
    }

    // 2. Parse payload
    const body = await req.json();
    requestBody = body;
    const { messages } = body;
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { success: false, error: "Messages array is required." },
        { status: 400 }
      );
    }

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { success: false, error: "Gemini API key is not configured on the server." },
        { status: 500 }
      );
    }

    // 3. Load full real-time portfolio data across ALL pages
    const data = await loadFullPortfolioKnowledge();

    // 4. Format skills with proficiency
    const skillsFormatted = data.skills
      .map((s) => `• ${s.name} [Category: ${s.category}] — Proficiency: ${s.proficiency}%`)
      .join("\n");

    // 5. Format education
    const educationFormatted = data.education
      .map(
        (e) =>
          `• ${e.degree} at ${e.institution} (${e.location || "India"}). Years: ${
            e.startYear || ""
          }-${e.endYear || "Current"}. Status: ${e.status || "completed"}. Grade/Info: ${
            e.grade || "N/A"
          }`
      )
      .join("\n");

    // 6. Format experience
    const experienceFormatted = data.experience
      .map(
        (exp) =>
          `• ${exp.title} at ${exp.company} (${exp.type}). Period: ${exp.startDate} to ${
            exp.endDate || "Present"
          }.\n  Bullets: ${exp.bullets.join("; ")}\n  Technologies: ${
            exp.technologies ? exp.technologies.join(", ") : "N/A"
          }`
      )
      .join("\n");

    // 7. Format projects (DB + Live metadata)
    const projectsFormatted = data.projects
      .map(
        (p) =>
          `• Project: ${p.title} (${p.type || "Featured Project"})\n  Description: ${
            p.description
          }\n  Technologies: ${p.technologies.join(", ")}\n  Status: ${
            p.status
          }\n  GitHub Repository: ${p.githubUrl || "None"}\n  Live Deployment URL: ${
            p.liveUrl || "None"
          }`
      )
      .join("\n\n");

    // 8. Format GitHub real-time repos
    const githubFormatted = data.githubStats
      ? `GitHub Profile: ${data.githubStats.user.login} (${data.githubStats.user.name})
Public Repositories: ${data.githubStats.totalRepos}
Total Stars Earned: ${data.githubStats.totalStars}
Total Forks: ${data.githubStats.totalForks}
Top Languages Used: ${Object.entries(data.githubStats.topLanguages || {})
          .map(([lang, count]) => `${lang} (${count})`)
          .join(", ")}

Live GitHub Repositories (Fetched via GitHub API / Token):
${data.githubRepos
  .slice(0, 10)
  .map(
    (repo) =>
      `• ${repo.name} (${repo.language || "Code"}): ${repo.description || "No description"}. Stars: ${
        repo.stargazersCount || 0
      }, Forks: ${repo.forksCount || 0}. URL: ${repo.htmlUrl}`
  )
  .join("\n")}`
      : "GitHub Token/API: Data dynamically synced with portfolio constants.";

    // 9. Format Blogs
    const blogsFormatted =
      data.blogs.length > 0
        ? data.blogs
            .map(
              (b) =>
                `• Article: "${b.title}" [${b.partNo}] by ${b.author || "Anubhav Singh"}\n  Last Updated: ${new Date(
                  b.updatedAt
                ).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}\n  Content Snippet: ${b.content.slice(0, 600)}...`
            )
            .join("\n\n")
        : "No blog articles posted yet.";

    // 10. Format Certifications
    const certsFormatted = data.certifications
      .map(
        (c) =>
          `• ${c.name} — Issued by ${c.issuer} (${c.year}) [Category: ${c.category || "General"}]. ${
            c.credentialUrl ? `Credential Link: ${c.credentialUrl}` : ""
          }`
      )
      .join("\n");

    // 11. Build System Prompt with complete live context
    const systemPrompt = `
You are Friday, Mr. Anubhav Singh's intelligent, witty, helpful, and highly capable virtual AI assistant.
Your intro speech when introduced or greeted: "Hey this is Friday Mr Anubhav Portfolio Website. Able to answer about Mr Anubhav Singh, his skills with proficiency levels, projects, GitHub repositories, blogs, education, work experience, and hobbies."

Tone: Sharp, confident, friendly, and professional (inspired by Marvel's FRIDAY AI).

You have full real-time access to ALL information across ALL pages of Mr. Anubhav Singh's portfolio. Refer to the real-time data below when answering queries:

============================================================
1. BIOGRAPHY & PERSONAL INFO
============================================================
• Full Name: ${OWNER.name} (@${OWNER.username})
• Current Title: ${OWNER.title}
• Roles: ${OWNER.roles.join(", ")}
• University: ${OWNER.university}
• Degree: ${OWNER.degree} (Expected Graduation: ${OWNER.expectedGraduation})
• Location: ${OWNER.location}
• Primary Bio: ${OWNER.bio}
• Lifestyle Bio: ${OWNER.bio2}
• Hobbies: Playing badminton, listening to music, watching movies/webseries/anime, living alone, and playing cricket as a batsman (not good at bowling!).

============================================================
2. CONTACT & SOCIAL LINKS
============================================================
• Email: ${CONTACT_INFO.email}
• LinkedIn: ${CONTACT_INFO.linkedin}
• GitHub: ${CONTACT_INFO.github}
• X (Twitter): ${CONTACT_INFO.twitter}
• Instagram: ${CONTACT_INFO.instagram}

============================================================
3. TECHNICAL SKILLS & PROFICIENCY LEVELS (Real-Time DB/Config)
============================================================
${skillsFormatted}

============================================================
4. EDUCATION BACKDROP (Real-Time)
============================================================
${educationFormatted}

============================================================
5. EXPERIENCE & INTERNSHIPS (Real-Time)
============================================================
${experienceFormatted}

============================================================
6. CERTIFICATIONS
============================================================
${certsFormatted}

============================================================
7. PROJECTS SHOWCASE (Fetched from DB & Live Links)
============================================================
${projectsFormatted}

============================================================
8. GITHUB PROFILE & REPOSITORIES (Real-Time GitHub API Token Sync)
============================================================
${githubFormatted}

============================================================
9. BLOGS & STORIES PAGE (Real-Time DB Sync)
============================================================
${blogsFormatted}
============================================================

General Guidelines:
1. Always refer to Anubhav as "Mr. Anubhav Singh" or "Mr. Anubhav".
2. If asked about proficiency in any technology or language (e.g. "What is your Python level?", "Tell me your skills with proficiency"), report the exact proficiency percentage from Section 3 above (e.g. "Python: 80%", "Git: 90%", "MySQL: 88%", "Linux: 85%", "Kali Linux: 82%", "HTML/CSS: 80%", "Firebase: 85%").
3. If asked about GitHub repos or projects, detail the tech stack, description, status, stars, and provide the direct GitHub/Live links.
4. If asked about blogs/stories, provide details about the title, part number, date/time, and story content.
5. If asked about current events, real-time news, weather, or info outside this portfolio knowledge, use the \`search_web\` tool to search the internet.
`;

    // 12. Construct message payload
    const apiMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content,
      })),
    ];

    // 13. Define Tools
    const tools = [
      {
        type: "function",
        function: {
          name: "search_web",
          description:
            "Searches the web for real-time news, current events, weather, or factual queries using DuckDuckGo.",
          parameters: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description:
                  "The search query, e.g. 'latest AI news' or 'cricket score today'",
              },
            },
            required: ["query"],
          },
        },
      },
    ];

    // 14. Query Gemini API (OpenAI compatibility endpoint)
    let response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GEMINI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gemini-2.5-flash",
          messages: apiMessages,
          tools,
          tool_choice: "auto",
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API returned error ${response.status}: ${errorText}`);
    }

    let payload = await response.json();
    let choice = payload.choices[0];
    let assistantMessage = choice.message;

    let searchQuery = "";
    let searchResults: { title: string; url: string; snippet: string }[] = [];

    // 15. Handle Web Search tool call if requested by LLM
    if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
      const toolCall = assistantMessage.tool_calls[0];
      if (toolCall.function.name === "search_web") {
        try {
          const args = JSON.parse(toolCall.function.arguments);
          searchQuery = args.query;
          searchResults = await searchDuckDuckGo(searchQuery);

          const secondRoundMessages = [
            { role: "system", content: systemPrompt },
            ...messages.map((m: { role: string; content: string }) => ({
              role: m.role === "user" ? "user" : "assistant",
              content: m.content,
            })),
            assistantMessage,
            {
              role: "tool",
              tool_call_id: toolCall.id,
              name: "search_web",
              content: JSON.stringify(searchResults),
            },
          ];

          const secondResponse = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${GEMINI_API_KEY}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "gemini-2.5-flash",
                messages: secondRoundMessages,
              }),
            }
          );

          if (!secondResponse.ok) {
            const errText = await secondResponse.text();
            throw new Error(`Gemini second-round API failed: ${errText}`);
          }

          const secondPayload = await secondResponse.json();
          choice = secondPayload.choices[0];
          assistantMessage = choice.message;
        } catch (toolError) {
          console.error("Error executing tool call in route:", toolError);
          assistantMessage = {
            role: "assistant",
            content:
              "I attempted to search the web for that, but encountered a connection glitch. However, I have complete real-time information about Mr. Anubhav Singh's portfolio, skills, projects, GitHub repos, and blogs ready for you!",
          };
        }
      }
    }

    return NextResponse.json({
      success: true,
      reply: assistantMessage.content,
      searchQuery,
      searchResults,
    });
  } catch (error) {
    console.error("Error in /api/friday API route:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong in Friday assistant.";

    // Smart Fallback Engine with full dynamic knowledge
    try {
      const data = await loadFullPortfolioKnowledge();
      const messages = requestBody?.messages || [];
      const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";

      let fallbackReply = "";

      if (
        lastMessage.includes("who is mr. anubhav") ||
        lastMessage.includes("who is anubhav") ||
        lastMessage.includes("about anubhav") ||
        lastMessage.includes("tell me about anubhav")
      ) {
        fallbackReply = `Mr. Anubhav Singh is a Pre-Final Year CS Engineering Student at GLA University, Mathura. Roles: ${OWNER.roles.join(
          ", "
        )}. ${OWNER.bio}`;
      } else if (
        lastMessage.includes("skill") ||
        lastMessage.includes("proficiency") ||
        lastMessage.includes("technolog") ||
        lastMessage.includes("stack")
      ) {
        const skillList = data.skills
          .map((s) => `• **${s.name}**: ${s.proficiency}% proficiency (${s.category})`)
          .join("\n");
        fallbackReply = `Here is Mr. Anubhav's real-time skill set with proficiency levels:\n\n${skillList}`;
      } else if (lastMessage.includes("project") || lastMessage.includes("portfolio")) {
        const projList = data.projects
          .map(
            (p) =>
              `• **${p.title}** (${p.type || "Project"}): ${p.description}\n  Tech: ${p.technologies.join(
                ", "
              )}\n  GitHub: ${p.githubUrl || "N/A"} | Live: ${p.liveUrl || "N/A"}`
          )
          .join("\n\n");
        fallbackReply = `Here are Mr. Anubhav's projects:\n\n${projList}`;
      } else if (
        lastMessage.includes("github") ||
        lastMessage.includes("repo") ||
        lastMessage.includes("star")
      ) {
        const repoList = data.githubRepos
          .slice(0, 5)
          .map(
            (r) =>
              `• **${r.name}** (${r.language || "Code"}): ${r.description || "No description"} [⭐ ${
                r.stargazersCount || 0
              }] — ${r.htmlUrl}`
          )
          .join("\n");
        fallbackReply = `Mr. Anubhav's GitHub profile (@${OWNER.username}) highlights:\n\n${repoList}`;
      } else if (lastMessage.includes("blog") || lastMessage.includes("story") || lastMessage.includes("article")) {
        const blogList = data.blogs
          .map(
            (b) =>
              `• **${b.title}** (${b.partNo}) — By ${b.author || "Anubhav Singh"} (Updated: ${new Date(
                b.updatedAt
              ).toLocaleDateString()})\n  ${b.content.slice(0, 150)}...`
          )
          .join("\n\n");
        fallbackReply = `Here are the latest blog posts & stories by Mr. Anubhav:\n\n${blogList || "No articles currently posted."}`;
      } else if (
        lastMessage.includes("education") ||
        lastMessage.includes("college") ||
        lastMessage.includes("university") ||
        lastMessage.includes("school")
      ) {
        const eduList = data.education
          .map((e) => `• **${e.degree}** from **${e.institution}** (${e.endYear || "Current"})`)
          .join("\n");
        fallbackReply = `Here is Mr. Anubhav's educational background:\n\n${eduList}`;
      } else if (
        lastMessage.includes("experience") ||
        lastMessage.includes("internship") ||
        lastMessage.includes("work")
      ) {
        const expList = data.experience
          .map(
            (e) =>
              `• **${e.title}** at **${e.company}** (${e.startDate} to ${e.endDate || "Present"})\n  ${e.bullets.join(
                " "
              )}`
          )
          .join("\n\n");
        fallbackReply = `Here is Mr. Anubhav's work & internship experience:\n\n${expList}`;
      } else if (
        lastMessage.includes("who are you") ||
        lastMessage.includes("friday") ||
        lastMessage.includes("introduce")
      ) {
        fallbackReply = `Hey this is Friday Mr Anubhav Portfolio Website. Able to answer about Mr Anubhav Singh, his skills with proficiency levels, projects, GitHub repositories, blogs, education, work experience, and hobbies.`;
      }

      if (fallbackReply) {
        return NextResponse.json({
          success: true,
          reply: `⚠️ *[Resilient Fallback Mode — Serving Live Real-Time Portfolio Knowledge]*\n\n${fallbackReply}`,
          searchQuery: "",
          searchResults: [],
        });
      }
    } catch (fallbackErr) {
      console.error("Fallback generator error:", fallbackErr);
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
