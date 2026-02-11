import type { Browser } from "puppeteer-core";

export interface ExtractedStory {
  storyId: string;
  html: string;
  styles: string;
  computedTokens: Record<string, string>;
}

const STORY_TIMEOUT = 15000; // 15s per story
const RENDER_WAIT = 1500; // wait after load for JS rendering

/**
 * Extract rendered HTML, styles, and CSS custom properties
 * from a single Storybook story iframe.
 */
export async function extractStory(
  browser: Browser,
  baseUrl: string,
  storyId: string
): Promise<ExtractedStory> {
  const page = await browser.newPage();
  const url = `${baseUrl.replace(/\/$/, "")}/iframe.html?id=${encodeURIComponent(storyId)}&viewMode=story`;

  try {
    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: STORY_TIMEOUT,
    });

    // Wait for storybook root to have content
    await page.waitForFunction(
      () => {
        const root =
          document.getElementById("storybook-root") ||
          document.getElementById("root") ||
          document.querySelector("#storybook-root") ||
          document.querySelector("[data-story]");
        return root && root.innerHTML.trim().length > 0;
      },
      { timeout: STORY_TIMEOUT }
    ).catch(() => {
      // Some stories render outside #root — continue anyway
    });

    // Extra wait for CSS/animations to settle
    await new Promise((r) => setTimeout(r, RENDER_WAIT));

    // Extract everything we need in a single evaluate call
    const result = await page.evaluate(() => {
      // Find the story root
      const root =
        document.getElementById("storybook-root") ||
        document.getElementById("root") ||
        document.body;

      // Get rendered HTML
      const html = root.innerHTML;

      // Collect all <style> tag contents
      const styleSheets = Array.from(document.querySelectorAll("style"));
      const styles = styleSheets.map((s) => s.textContent || "").join("\n");

      // Extract CSS custom properties from :root and document
      const computedTokens: Record<string, string> = {};

      // Get from computed style on :root
      const rootStyle = getComputedStyle(document.documentElement);

      // Scan all stylesheets for custom property declarations
      try {
        for (const sheet of Array.from(document.styleSheets)) {
          try {
            for (const rule of Array.from(sheet.cssRules)) {
              if (rule instanceof CSSStyleRule) {
                const style = rule.style;
                for (let i = 0; i < style.length; i++) {
                  const prop = style[i];
                  if (prop.startsWith("--")) {
                    // Get computed value from :root
                    const computed = rootStyle.getPropertyValue(prop).trim();
                    if (computed) {
                      computedTokens[prop] = computed;
                    } else {
                      computedTokens[prop] = style.getPropertyValue(prop).trim();
                    }
                  }
                }
              }
            }
          } catch {
            // CORS stylesheet — skip
          }
        }
      } catch {
        // stylesheet access error — skip
      }

      return { html, styles, computedTokens };
    });

    return {
      storyId,
      ...result,
    };
  } finally {
    await page.close();
  }
}

/**
 * Extract stories in parallel with concurrency limit.
 */
export async function extractStories(
  browser: Browser,
  baseUrl: string,
  storyIds: string[],
  concurrency: number = 3,
  onProgress?: (done: number, total: number) => void
): Promise<{ results: ExtractedStory[]; errors: string[] }> {
  const results: ExtractedStory[] = [];
  const errors: string[] = [];
  let done = 0;

  // Process in batches
  for (let i = 0; i < storyIds.length; i += concurrency) {
    const batch = storyIds.slice(i, i + concurrency);
    const batchResults = await Promise.allSettled(
      batch.map((id) => extractStory(browser, baseUrl, id))
    );

    for (let j = 0; j < batchResults.length; j++) {
      const result = batchResults[j];
      if (result.status === "fulfilled") {
        results.push(result.value);
      } else {
        errors.push(`${batch[j]}: ${result.reason?.message || "Unknown error"}`);
      }
      done++;
      onProgress?.(done, storyIds.length);
    }

    // Small delay between batches to avoid overwhelming the server
    if (i + concurrency < storyIds.length) {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  return { results, errors };
}
