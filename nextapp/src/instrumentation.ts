export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Avoid running this during next build (static site generation)
    if (process.env.NEXT_PHASE === "phase-production-build") {
      return;
    }

    const url = process.env.KEEP_ALIVE_URL || process.env.RENDER_EXTERNAL_URL || "https://bhavportfolio.online";
    if (url) {
      console.log(`[Keep-Alive] Initializing self-ping loop for URL: ${url}`);
      
      const ping = async () => {
        try {
          const target = url.endsWith("/") ? `${url}api/ping` : `${url}/api/ping`;
          const res = await fetch(target);
          console.log(`[Keep-Alive] Pinged ${target} - Status: ${res.status}`);
        } catch (err) {
          console.error("[Keep-Alive] Ping failed:", err);
        }
      };

      // Set interval to ping every 10 minutes (600,000 ms)
      const intervalId = setInterval(ping, 600000);

      // Unreference the timer so it doesn't prevent Node process from exiting
      if (intervalId && typeof intervalId.unref === "function") {
        intervalId.unref();
      }
    } else {
      console.log("[Keep-Alive] No keep-alive URL specified. Skipping self-ping loop.");
    }
  }
}
