import { NextResponse } from "next/server";
import { ContactSchema } from "@/lib/validations";
import prisma from "@/lib/db";
import { createRateLimiter } from "@/lib/redis";
import { getClientIp } from "@/lib/utils";

const webhookUrl = process.env.CONTACT_WEBHOOK_URL;

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting
    const ip = getClientIp(req);
    const limiter = createRateLimiter(5, 60); // 5 requests per 60 seconds
    const { success, limit, remaining, reset } = await limiter.limit(
      `contact:${ip}`
    );

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many messages. Please try again in a few minutes.",
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        }
      );
    }

    // 2. Parse and Validate Form Body
    const body = await req.json();
    const validation = ContactSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.issues[0]?.message || "Validation failed",
        },
        { status: 400 }
      );
    }

    const { name, email, phone, message } = validation.data;

    // 3. Save to Database (if available)
    let savedMessage = null;
    const dbConnected = !!process.env.TURSO_DATABASE_URL;

    if (dbConnected) {
      try {
        savedMessage = await prisma.contactMessage.create({
          data: {
            name,
            email,
            phone: phone || null,
            message,
            ipAddress: ip,
          },
        });
        console.log("Contact message saved to database.");
      } catch (dbError) {
        console.error("Failed to save contact message to database:", dbError);
        // Do not crash, proceed to try webhooks/logs so form can work in degraded/demo mode
      }
    } else {
      console.warn("Database not configured. Contact message not saved in DB.");
    }

    // 4. Send Webhook Notification to Discord
    if (webhookUrl) {
      try {
        const discordEmbed = {
          embeds: [
            {
              title: "💼 New Portfolio Contact Message",
              description: `Received a new submission from **${name}**`,
              color: 3447003, // nice cyan-blue
              fields: [
                { name: "Name", value: name, inline: true },
                { name: "Email", value: email, inline: true },
                { name: "Phone", value: phone || "Not provided", inline: true },
                { name: "Message", value: message },
                { name: "IP Address", value: ip, inline: true },
                { name: "Database Saved", value: savedMessage ? "Yes" : "No (Degraded/Demo Mode)", inline: true },
              ],
              timestamp: new Date().toISOString(),
              footer: {
                text: "Portfolio Contact Form Service",
              },
            },
          ],
        };

        const discordRes = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(discordEmbed),
        });

        if (!discordRes.ok) {
          console.error(`Discord Webhook returned status code: ${discordRes.status}`);
        }
      } catch (webhookError) {
        console.error("Failed to trigger Discord webhook notification:", webhookError);
      }
    } else {
      console.warn("Discord Webhook url not configured.");
    }

    return NextResponse.json({
      success: true,
      message: "Your message has been sent successfully!",
    });
  } catch (error: any) {
    console.error("API error in /api/contact:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      },
      { status: 500 }
    );
  }
}
