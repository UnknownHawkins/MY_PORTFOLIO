import { NextRequest, NextResponse } from "next/server";
import { createRateLimiter } from "@/lib/redis";
import { OWNER, CONTACT_INFO, SKILLS, EDUCATION, CERTIFICATIONS, PROJECTS } from "@/lib/constants";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

// Web search utility using DuckDuckGo HTML scraper
async function searchDuckDuckGo(query: string) {
  try {
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
    if (!response.ok) {
      throw new Error(`DDG returned status ${response.status}`);
    }
    const html = await response.text();
    const results = [];
    const resultBlocks = html.split('class="result results_links results_links_deep web-result ');
    
    for (let i = 1; i < resultBlocks.length && i <= 5; i++) {
      const block = resultBlocks[i];
      
      const linkMatch = block.match(/<a\s+[^>]*href="([^"]+)"[^>]*class="result__a"[^>]*>([\s\S]*?)<\/a>/i) ||
                        block.match(/<a\s+[^>]*class="result__a"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i);
      
      const snippetMatch = block.match(/<a\s+[^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/a>/i) ||
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
        const snippet = snippetMatch ? snippetMatch[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() : "";
        
        results.push({ title, url, snippet });
      }
    }
    return results;
  } catch (err) {
    console.error("DuckDuckGo search scraper failed:", err);
    return [];
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Get IP address & apply rate limiting
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
    
    const limiter = createRateLimiter(15, 60); // 15 prompts/min limit
    const { success } = await limiter.limit(`friday:${ip}`);
    if (!success) {
      return NextResponse.json(
        { success: false, error: "Too many AI requests. Please wait a moment." },
        { status: 429 }
      );
    }

    // 2. Parse request body
    const body = await req.json();
    const { messages } = body;
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { success: false, error: "Messages array is required." },
        { status: 400 }
      );
    }

    if (!DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { success: false, error: "DeepSeek API key is not configured on the server." },
        { status: 500 }
      );
    }

    // 3. Build Friday persona & knowledge system prompt
    const portfolioBio = `
Identity/Owner:
- Name: ${OWNER.name}
- Title: ${OWNER.title}
- Target/User roles: ${OWNER.roles.join(", ")}
- University: ${OWNER.university}
- Degree: ${OWNER.degree}
- Expected Graduation: ${OWNER.expectedGraduation}
- Bio summary: ${OWNER.bio}
- Detailed bio: ${OWNER.bio2}
- Location: ${OWNER.location}

Hobbies:
- Play badminton
- Live alone
- Play cricket as a batsman (not good at bowling)
- Listening to music
- Watching movies, webseries, and anime

Contact info:
- Email: ${CONTACT_INFO.email}
- LinkedIn: ${CONTACT_INFO.linkedin}
- GitHub: ${CONTACT_INFO.github}
- Twitter/X: ${CONTACT_INFO.twitter}
- Instagram: ${CONTACT_INFO.instagram}

Technical Skills:
${SKILLS.map(s => `- ${s.name} (${s.category}, proficiency: ${s.proficiency}%)`).join("\n")}

Education Details:
${EDUCATION.map(e => `- ${e.degree} at ${e.institution} (${e.endYear || "current"}). Status: ${e.status}. Grade/Title: ${e.grade}`).join("\n")}

Certifications:
${CERTIFICATIONS.map(c => `- ${c.name} issued by ${c.issuer} (${c.year})`).join("\n")}

Projects Showcase:
${PROJECTS.map(p => `- ${p.title}: ${p.description}. Tech: ${p.technologies.join(", ")}. Status: ${p.status}. Github: ${p.githubUrl || "None"}. Live URL: ${p.liveUrl || "None"}`).join("\n")}
`;

    const systemPrompt = `
You are Friday, Mr. Anubhav Singh's smart, helpful, and highly capable virtual AI assistant.
Your intro: "Hey this is Friday Mr Anubhav Portfolio Website. Able to answer with about Mr Anubhav Singh and, his projects, technologies that he used, about hobbies.".

Keep your tone witty, sharp, professional yet friendly (inspired by Tony Stark's FRIDAY). 
You have access to Anubhav's entire portfolio database context, which is loaded below. Refer to this data when answering questions about him.

Anubhav's Portfolio Information:
=================================
${portfolioBio}
=================================

General Abilities:
1. You can write essays, cover letters, applications, solve programming tasks, and general moderate questions.
2. If asked about current events, real-time info, sports results, current news, weather, or information outside your database, you MUST use the search_web tool to search the internet. Do not hallucinate or guess current news.

Constraints:
- Always refer to Anubhav as "Mr. Anubhav Singh" or "Mr. Anubhav" in conversation.
- If asked "Who are you?", state your intro clearly.
- If you run a web search, synthesize the search result snippets in a clear, concise, and structured way. Always list the source URLs if available.
`;

    // 4. Construct message payloads
    const apiMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content
      }))
    ];

    // 5. Define Tools for LLM
    const tools = [
      {
        type: "function",
        function: {
          name: "search_web",
          description: "Searches the web for real-time news, current events, weather, or factual queries using DuckDuckGo.",
          parameters: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "The search query, e.g. 'latest AI news' or 'who won the cricket match today'"
              }
            },
            required: ["query"]
          }
        }
      }
    ];

    // 6. Request DeepSeek API (Standard OpenAI structure)
    console.log("Calling DeepSeek API with user message...");
    let response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: apiMessages,
        tools,
        tool_choice: "auto"
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`DeepSeek API returned error ${response.status}: ${errorText}`);
    }

    let payload = await response.json();
    let choice = payload.choices[0];
    let assistantMessage = choice.message;

    let searchQuery = "";
    let searchResults: { title: string; url: string; snippet: string }[] = [];

    // 7. Handle Tool Calls if triggered
    if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
      const toolCall = assistantMessage.tool_calls[0];
      if (toolCall.function.name === "search_web") {
        try {
          const args = JSON.parse(toolCall.function.arguments);
          searchQuery = args.query;
          console.log(`Tool Triggered: search_web with query: "${searchQuery}"`);
          
          // Run the DuckDuckGo scraper
          searchResults = await searchDuckDuckGo(searchQuery);
          console.log(`Search completed, found ${searchResults.length} results.`);

          // Feed the results back to the LLM
          const secondRoundMessages = [
            { role: "system", content: systemPrompt },
            ...messages.map((m: { role: string; content: string }) => ({
              role: m.role === "user" ? "user" : "assistant",
              content: m.content
            })),
            assistantMessage,
            {
              role: "tool",
              tool_call_id: toolCall.id,
              name: "search_web",
              content: JSON.stringify(searchResults)
            }
          ];

          // Query DeepSeek again with the search results
          console.log("Sending search results back to DeepSeek...");
          const secondResponse = await fetch("https://api.deepseek.com/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model: "deepseek-chat",
              messages: secondRoundMessages
            })
          });

          if (!secondResponse.ok) {
            const errText = await secondResponse.text();
            throw new Error(`DeepSeek second-round API failed: ${errText}`);
          }

          const secondPayload = await secondResponse.json();
          choice = secondPayload.choices[0];
          assistantMessage = choice.message;
        } catch (toolError) {
          console.error("Error executing tool call in route:", toolError);
          // Return generic error reply
          assistantMessage = {
            role: "assistant",
            content: "I attempted to search the web for that, but encountered an error. However, based on what I know: I'm ready to answer any questions about Mr. Anubhav Singh!"
          };
        }
      }
    }

    return NextResponse.json({
      success: true,
      reply: assistantMessage.content,
      searchQuery,
      searchResults
    });

  } catch (error) {
    console.error("Error in /api/friday API route:", error);
    const errorMessage = error instanceof Error ? error.message : "Something went wrong in Friday assistant.";
    
    // Attempt rule-based fallback for popular queries when API is offline/out of balance
    try {
      const reqClone = req.clone();
      const body = await reqClone.json().catch(() => ({}));
      const messages = body.messages || [];
      const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";
      
      let fallbackReply = "";
      
      if (lastMessage.includes("who is mr. anubhav") || lastMessage.includes("who is anubhav") || lastMessage.includes("about anubhav") || lastMessage.includes("tell me about anubhav") || lastMessage.includes("who is mr. anubhav singh")) {
        fallbackReply = `Mr. Anubhav Singh is a Pre Final-Year CS Engineering Student at GLA University, Mathura. He is a Python Developer, Cybersecurity Enthusiast, Web Developer, and Open Source Contributor. ${OWNER.bio}`;
      } else if (lastMessage.includes("project") || lastMessage.includes("portfolio")) {
        const projList = PROJECTS.map(p => `• **${p.title}**: ${p.description} (Tech: ${p.technologies.join(", ")})`).join("\n");
        fallbackReply = `Here are some of Mr. Anubhav's projects:\n\n${projList}`;
      } else if (lastMessage.includes("hobby") || lastMessage.includes("hobbies") || lastMessage.includes("lifestyle") || lastMessage.includes("cricket") || lastMessage.includes("anime") || lastMessage.includes("badminton") || lastMessage.includes("batminton")) {
        fallbackReply = `Mr. Anubhav's hobbies include playing badminton, listening to music, watching movies, webseries, and anime. He lives alone and plays cricket as a batsman (because he is not good at bowling!).`;
      } else if (lastMessage.includes("skill") || lastMessage.includes("technolog") || lastMessage.includes("languages") || lastMessage.includes("stack")) {
        const skillList = SKILLS.map(s => s.name).join(", ");
        fallbackReply = `Mr. Anubhav has experience in the following technical areas:\n\n${skillList}`;
      } else if (lastMessage.includes("education") || lastMessage.includes("college") || lastMessage.includes("university") || lastMessage.includes("school")) {
        const eduList = EDUCATION.map(e => `• **${e.degree}** from **${e.institution}** (${e.endYear || "Current"})`).join("\n");
        fallbackReply = `Here is Mr. Anubhav's educational background:\n\n${eduList}`;
      } else if (lastMessage.includes("who are you") || lastMessage.includes("friday") || lastMessage.includes("introduce")) {
        fallbackReply = `Hey this is Friday Mr Anubhav Portfolio Website. Able to answer with about Mr Anubhav Singh and, his projects, techonologis that he used, about hobbies= play batminton, live alone, paly cricket as a batsman because he is not good at bowling, listening the music, watching movies,webseries, anime.`;
      }
      
      if (fallbackReply) {
        let warningText = "⚠️ *[Fallback Mode - DeepSeek API Insufficient Balance]*";
        if (errorMessage.includes("402") || errorMessage.includes("Insufficient Balance")) {
          warningText = "⚠️ *[DeepSeek API Out of Balance — Running in Resilient Fallback Mode]*";
        }
        return NextResponse.json({
          success: true,
          reply: `${warningText}\n\n${fallbackReply}\n\n*(Note: To enable full AI chat capabilities, please top up your DeepSeek account or update DEEPSEEK_API_KEY in .env.local)*`,
          searchQuery: "",
          searchResults: []
        });
      }
    } catch (fallbackErr) {
      console.error("Fallback generator error:", fallbackErr);
    }

    let clientErrorMessage = errorMessage;
    if (errorMessage.includes("402") || errorMessage.includes("Insufficient Balance")) {
      clientErrorMessage = "DeepSeek API returned error 402: Insufficient Balance. Please top up your DeepSeek developer account or update the DEEPSEEK_API_KEY in your env file to restore full AI chat capabilities.";
    }

    return NextResponse.json(
      { success: false, error: clientErrorMessage },
      { status: 500 }
    );
  }
}
