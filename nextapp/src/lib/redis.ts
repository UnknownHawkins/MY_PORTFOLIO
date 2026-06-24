import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

// Initialize Redis client only if credentials are provided
export const redis =
  redisUrl && redisToken
    ? new Redis({
        url: redisUrl,
        token: redisToken,
      })
    : null;

// Rate limiter factory with dynamic limits and fallback when Redis is offline/not configured
export function createRateLimiter(limit = 5, windowInSeconds = 60) {
  if (!redis) {
    // Graceful fallback: allow all requests in development/degraded mode
    return {
      limit: async (key: string) => {
        return {
          success: true,
          limit,
          remaining: limit,
          reset: Date.now() + windowInSeconds * 1000,
        };
      },
    };
  }

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, `${windowInSeconds} s`),
    analytics: true,
    prefix: "@upstash/ratelimit",
  });
}
