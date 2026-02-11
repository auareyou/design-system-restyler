import { NextRequest } from "next/server";
import fs from "fs";
import { scrapeStorybook, type ScrapeProgress } from "@/lib/scraper/storybook";

export const maxDuration = 300; // 5 min timeout for scraping

/**
 * POST /api/scrape
 * Accepts a Storybook URL and streams progress via Server-Sent Events.
 *
 * Request body: { url: string, executablePath?: string }
 *
 * SSE events:
 *   - progress: { phase, done, total }
 *   - complete: { components, tokens, warnings, stats }
 *   - error: { message }
 */
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { url, executablePath } = body as {
    url: string;
    executablePath?: string;
  };

  if (!url) {
    return new Response(
      JSON.stringify({ error: "Missing required field: url" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Validate URL
  try {
    new URL(url);
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid URL" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Determine Chrome path
  const chromePath = executablePath || findChromePath();
  if (!chromePath) {
    return new Response(
      JSON.stringify({
        error:
          "Could not find Chrome/Chromium. " +
          "Set PUPPETEER_EXECUTABLE_PATH env var or pass executablePath in the request body. " +
          "Common paths:\n" +
          "  macOS: /Applications/Google Chrome.app/Contents/MacOS/Google Chrome\n" +
          "  Linux: /usr/bin/chromium-browser or /usr/bin/google-chrome\n" +
          "  Windows: C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  // Stream response using SSE
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      function send(event: string, data: unknown) {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
        );
      }

      try {
        const result = await scrapeStorybook(
          url,
          chromePath,
          (progress: ScrapeProgress) => {
            send("progress", progress);
          }
        );

        send("complete", result);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        send("error", { message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

/**
 * Try to find Chrome/Chromium on the system.
 */
function findChromePath(): string | null {
  // Check env var first
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }

  // Common paths by platform
  const paths: string[] = [];

  if (process.platform === "darwin") {
    paths.push(
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      "/Applications/Chromium.app/Contents/MacOS/Chromium",
      "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
      "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
    );
  } else if (process.platform === "linux") {
    paths.push(
      "/usr/bin/chromium-browser",
      "/usr/bin/chromium",
      "/usr/bin/google-chrome",
      "/usr/bin/google-chrome-stable",
    );
  } else if (process.platform === "win32") {
    paths.push(
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    );
  }

  for (const p of paths) {
    try {
      if (fs.existsSync(p)) return p;
    } catch {
      continue;
    }
  }

  return null;
}
