import puppeteer, { type Browser } from "puppeteer-core";
import {
  fetchStoryIndex,
  groupStories,
  type GroupedStory,
} from "./story-fetcher";
import { extractStories, type ExtractedStory } from "./iframe-extractor";
import { ComponentGroup, ExtractedComponent } from "../types/component";
import { Token, TokenSet, TokenCategory } from "../types/token";

const MAX_STORIES = 50; // Cap to avoid scraping 500+ stories

/**
 * Categorize a CSS custom property name into a token category.
 */
function categorizeToken(name: string): TokenCategory {
  const n = name.toLowerCase();
  if (
    n.includes("color") ||
    n.includes("-bg") ||
    n.includes("-fg") ||
    n.includes("background") ||
    n.includes("text-color") ||
    n.includes("fill") ||
    n.includes("stroke")
  ) return "color";
  if (
    n.includes("spacing") ||
    n.includes("space") ||
    n.includes("gap") ||
    n.includes("margin") ||
    n.includes("padding")
  ) return "spacing";
  if (n.includes("radius") || n.includes("rounded")) return "radius";
  if (n.includes("shadow") || n.includes("elevation")) return "shadow";
  if (
    n.includes("font") ||
    n.includes("text-size") ||
    n.includes("line-height") ||
    n.includes("letter-spacing") ||
    n.includes("weight")
  ) return "typography";
  if (n.includes("border")) return "border";
  if (n.includes("opacity") || n.includes("alpha")) return "opacity";
  if (
    n.includes("transition") ||
    n.includes("duration") ||
    n.includes("easing") ||
    n.includes("animation")
  ) return "transition";

  // Fallback: try to guess from value
  return "color";
}

/**
 * Merge computed tokens from all extracted stories into a single token set.
 */
function buildTokenSet(
  extractedStories: ExtractedStory[],
  label: string
): TokenSet {
  const tokenMap = new Map<string, string>();

  for (const story of extractedStories) {
    for (const [name, value] of Object.entries(story.computedTokens)) {
      // First occurrence wins (closest to :root)
      if (!tokenMap.has(name) && value) {
        tokenMap.set(name, value);
      }
    }
  }

  const tokens: Token[] = [];
  tokenMap.forEach((value, name) => {
    tokens.push({
      name,
      value,
      category: categorizeToken(name),
    });
  });

  // Sort: colors first, then by name
  tokens.sort((a, b) => {
    if (a.category !== b.category) {
      const order: TokenCategory[] = [
        "color", "typography", "spacing", "radius",
        "shadow", "border", "opacity", "transition",
      ];
      return order.indexOf(a.category) - order.indexOf(b.category);
    }
    return a.name.localeCompare(b.name);
  });

  return {
    id: `extracted-${Date.now()}`,
    label,
    tokens,
    source: "extracted",
  };
}

/**
 * Build component groups from grouped stories and extracted data.
 */
function buildComponentGroups(
  grouped: GroupedStory[],
  extracted: ExtractedStory[]
): ComponentGroup[] {
  const extractedMap = new Map(extracted.map((e) => [e.storyId, e]));

  // Group by the top-level group name
  const groupMap = new Map<string, ExtractedComponent[]>();

  for (const g of grouped) {
    // Find the first successfully extracted story for this component
    const storyData = g.stories
      .map((s) => extractedMap.get(s.id))
      .find((e) => e && e.html.trim().length > 0);

    if (!storyData) continue;

    const component: ExtractedComponent = {
      id: g.component.toLowerCase().replace(/\s+/g, "-"),
      name: g.component,
      group: g.group,
      html: storyData.html,
      inlineStyles: storyData.styles,
      stories: g.stories.map((s) => ({
        id: s.id,
        name: s.name,
        html: extractedMap.get(s.id)?.html || "",
        storyId: s.id,
      })),
    };

    const topGroup = g.group.split("/")[0] || "Ungrouped";
    if (!groupMap.has(topGroup)) {
      groupMap.set(topGroup, []);
    }
    groupMap.get(topGroup)!.push(component);
  }

  const groups: ComponentGroup[] = [];
  groupMap.forEach((components, name) => {
    groups.push({ name, components });
  });

  return groups;
}

export interface ScrapeResult {
  components: ComponentGroup[];
  tokens: TokenSet;
  warnings: string[];
  stats: {
    totalStories: number;
    scrapedStories: number;
    extractedTokens: number;
    components: number;
  };
}

export interface ScrapeProgress {
  phase: "fetching_index" | "extracting_stories" | "building_tokens";
  done: number;
  total: number;
}

/**
 * Full scrape pipeline: fetch index → extract stories → build tokens.
 */
export async function scrapeStorybook(
  url: string,
  executablePath: string,
  onProgress?: (progress: ScrapeProgress) => void
): Promise<ScrapeResult> {
  const warnings: string[] = [];

  // 1. Fetch story index
  onProgress?.({ phase: "fetching_index", done: 0, total: 1 });
  const index = await fetchStoryIndex(url);
  const grouped = groupStories(index);

  // Collect all story IDs (capped)
  const allStoryIds = grouped.flatMap((g) => g.stories.map((s) => s.id));
  const storyIds = allStoryIds.slice(0, MAX_STORIES);

  if (allStoryIds.length > MAX_STORIES) {
    warnings.push(
      `Found ${allStoryIds.length} stories, scraping first ${MAX_STORIES}. ` +
      `You can select specific components after scraping.`
    );
  }

  onProgress?.({ phase: "fetching_index", done: 1, total: 1 });

  // 2. Launch browser and extract stories
  let browser: Browser | null = null;
  try {
    browser = await puppeteer.launch({
      executablePath,
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });

    const { results, errors } = await extractStories(
      browser,
      url,
      storyIds,
      3,
      (done, total) => {
        onProgress?.({ phase: "extracting_stories", done, total });
      }
    );

    if (errors.length > 0) {
      warnings.push(`${errors.length} stories failed to extract: ${errors.slice(0, 3).join("; ")}`);
    }

    // 3. Build tokens and component groups
    onProgress?.({ phase: "building_tokens", done: 0, total: 1 });

    const hostname = new URL(url).hostname;
    const tokens = buildTokenSet(results, `${hostname} (extracted)`);
    const components = buildComponentGroups(grouped, results);

    onProgress?.({ phase: "building_tokens", done: 1, total: 1 });

    return {
      components,
      tokens,
      warnings,
      stats: {
        totalStories: allStoryIds.length,
        scrapedStories: results.length,
        extractedTokens: tokens.tokens.length,
        components: components.reduce((sum, g) => sum + g.components.length, 0),
      },
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
