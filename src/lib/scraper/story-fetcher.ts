/**
 * Fetch the story index from a Storybook instance.
 * Tries /index.json (Storybook 7+) then /stories.json (Storybook 6).
 */

export interface StoryEntry {
  id: string;
  title: string;
  name: string;
  type?: string; // "story" | "docs"
  importPath?: string;
}

export interface StoryIndex {
  entries: Record<string, StoryEntry>;
  version: number;
}

export async function fetchStoryIndex(baseUrl: string): Promise<StoryIndex> {
  const url = baseUrl.replace(/\/$/, "");

  // Try Storybook 7+ format first
  try {
    const res = await fetch(`${url}/index.json`);
    if (res.ok) {
      const data = await res.json();
      // Storybook 7 has { entries: { ... } } or { v: 5, entries: { ... } }
      if (data.entries) {
        return { entries: data.entries, version: 7 };
      }
    }
  } catch {
    // fall through
  }

  // Try Storybook 6 format
  try {
    const res = await fetch(`${url}/stories.json`);
    if (res.ok) {
      const data = await res.json();
      // Storybook 6 has { v: 3, stories: { ... } }
      if (data.stories) {
        // Normalize to same shape as v7
        const entries: Record<string, StoryEntry> = {};
        for (const [id, story] of Object.entries(data.stories)) {
          const s = story as Record<string, unknown>;
          entries[id] = {
            id,
            title: (s.title as string) || (s.kind as string) || "",
            name: (s.name as string) || (s.story as string) || "",
            type: "story",
          };
        }
        return { entries, version: 6 };
      }
    }
  } catch {
    // fall through
  }

  throw new Error(
    `Could not fetch story index from ${url}. ` +
    `Tried /index.json and /stories.json. ` +
    `Make sure the Storybook is publicly accessible.`
  );
}

/**
 * Group stories by component name.
 * e.g. "Components/Button" → group "Components", component "Button"
 */
export interface GroupedStory {
  group: string;
  component: string;
  stories: StoryEntry[];
}

export function groupStories(index: StoryIndex): GroupedStory[] {
  const grouped = new Map<string, GroupedStory>();

  for (const entry of Object.values(index.entries)) {
    // Skip docs-only entries
    if (entry.type === "docs") continue;

    const parts = entry.title.split("/");
    const component = parts[parts.length - 1];
    const group = parts.length > 1 ? parts.slice(0, -1).join("/") : "Ungrouped";

    const key = entry.title;
    if (!grouped.has(key)) {
      grouped.set(key, { group, component, stories: [] });
    }
    grouped.get(key)!.stories.push(entry);
  }

  return Array.from(grouped.values());
}
