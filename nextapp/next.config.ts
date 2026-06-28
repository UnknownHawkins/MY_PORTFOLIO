// ============================================================
// Next.js 15 Configuration
// ============================================================
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable X-Powered-By header for security
  poweredByHeader: false,

  // Enable standalone build for Docker
  output: "standalone",

  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/u/**",
      },
      {
        protocol: "https",
        hostname: "github.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "opengraph.githubassets.com",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self';",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval';",
              "style-src 'self' 'unsafe-inline';",
              "img-src 'self' blob: data: https://avatars.githubusercontent.com https://github.com https://raw.githubusercontent.com https://opengraph.githubassets.com;",
              "font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com;",
              "connect-src 'self';",
              "object-src 'none';",
              "base-uri 'self';",
              "form-action 'self';",
              "frame-ancestors 'none';",
              "upgrade-insecure-requests;",
            ].join(" "),
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "same-origin",
          },
        ],
      },
      {
        // Cache static assets aggressively
        source: "/assets/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Redirects for clean URLs
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
    ];
  },

  // Experimental features
  experimental: {
    // Optimize server components
    optimizePackageImports: [
      "framer-motion",
      "lucide-react",
      "@radix-ui/react-icons",
    ],
  },

  // Compiler options
  compiler: {
    // Remove console.log in production
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },
};

export default nextConfig;
