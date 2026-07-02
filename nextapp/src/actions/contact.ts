"use server";

import { headers } from "next/headers";
import { ContactSchema, type ContactFormValues } from "@/lib/validations";
import prisma from "@/lib/db";
import { createRateLimiter } from "@/lib/redis";

const webhookUrl = process.env.CONTACT_WEBHOOK_URL;

export async function submitContactForm(data: ContactFormValues) {
  try {
    // 1. Get client IP address
    const headersList = await headers();
    const forwarded = headersList.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";

    // 2. Rate Limiting via Upstash Redis
    const limiter = createRateLimiter(5, 60);
    const { success } = await limiter.limit(`contact:${ip}`);

    if (!success) {
      return {
        success: false,
        error: "Too many messages. Please try again in a few minutes.",
      };
    }

    // 3. Validate form fields
    const parsed = ContactSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Validation failed",
      };
    }

    const { name, email, phone, message } = parsed.data;

    // 4. Save to database
    let savedMsg = null;
    if (process.env.TURSO_DATABASE_URL) {
      try {
        savedMsg = await prisma.contactMessage.create({
          data: {
            name,
            email,
            phone: phone || null,
            message,
            ipAddress: ip,
          },
        });
      } catch (dbError) {
        console.error("Database save failed in server action:", dbError);
      }
    }

    // 5. Trigger Discord Webhook
    if (webhookUrl) {
      try {
        const discordPayload = {
          embeds: [
            {
              title: "💼 New Contact Submission (Server Action)",
              description: `Received a new message from **${name}**`,
              color: 3447003,
              fields: [
                { name: "Name", value: name, inline: true },
                { name: "Email", value: email, inline: true },
                { name: "Phone", value: phone || "Not provided", inline: true },
                { name: "Message", value: message },
                { name: "IP Address", value: ip, inline: true },
                { name: "DB Status", value: savedMsg ? "Saved" : "Not Saved (Demo Mode)", inline: true },
              ],
              timestamp: new Date().toISOString(),
            },
          ],
        };

        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(discordPayload),
        });
      } catch (webhookError) {
        console.error("Discord Webhook failed in server action:", webhookError);
      }
    }

    return {
      success: true,
      message: "Thank you! Your message has been received.",
    };
  } catch (error: any) {
    console.error("Contact Form Server Action error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}
