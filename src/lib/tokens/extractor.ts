import { Token, TokenSet, TokenCategory } from "../types/token";

/**
 * Categorize a CSS custom property name.
 */
export function categorizeToken(name: string): TokenCategory {
  const n = name.toLowerCase();
  if (
    n.includes("color") || n.includes("-bg") || n.includes("-fg") ||
    n.includes("background") || n.includes("fill") || n.includes("stroke")
  ) return "color";
  if (
    n.includes("spacing") || n.includes("space") || n.includes("gap") ||
    n.includes("margin") || n.includes("padding")
  ) return "spacing";
  if (n.includes("radius") || n.includes("rounded")) return "radius";
  if (n.includes("shadow") || n.includes("elevation")) return "shadow";
  if (
    n.includes("font") || n.includes("text-size") || n.includes("line-height") ||
    n.includes("letter-spacing") || n.includes("weight")
  ) return "typography";
  if (n.includes("border")) return "border";
  if (n.includes("opacity") || n.includes("alpha")) return "opacity";
  if (
    n.includes("transition") || n.includes("duration") ||
    n.includes("easing") || n.includes("animation")
  ) return "transition";
  return "color";
}

/**
 * Extract CSS custom properties from one or more CSS text strings.
 * Deduplicates by name, preferring values from :root scope.
 */
export function extractTokens(
  cssTexts: string[],
  computedStyles?: Record<string, string>
): TokenSet {
  const tokenMap = new Map<string, { value: string; isRoot: boolean }>();

  for (const css of cssTexts) {
    // Match custom property declarations
    const regex = /(?::root|html|\[data-theme[^\]]*\])\s*\{([^}]+)\}/g;
    let blockMatch;

    while ((blockMatch = regex.exec(css)) !== null) {
      const block = blockMatch[1];
      const isRoot = blockMatch[0].includes(":root");
      const propRegex = /(--[\w-]+)\s*:\s*([^;]+);/g;
      let propMatch;

      while ((propMatch = propRegex.exec(block)) !== null) {
        const name = propMatch[1];
        const value = propMatch[2].trim();

        // Prefer :root values over other scopes
        const existing = tokenMap.get(name);
        if (!existing || (isRoot && !existing.isRoot)) {
          tokenMap.set(name, { value, isRoot });
        }
      }
    }

    // Also catch custom properties outside of any specific selector block
    const looseRegex = /(--[\w-]+)\s*:\s*([^;]+);/g;
    let looseMatch;
    while ((looseMatch = looseRegex.exec(css)) !== null) {
      const name = looseMatch[1];
      const value = looseMatch[2].trim();
      if (!tokenMap.has(name)) {
        tokenMap.set(name, { value, isRoot: false });
      }
    }
  }

  // Override with computed styles if provided
  if (computedStyles) {
    for (const [name, value] of Object.entries(computedStyles)) {
      if (value) {
        tokenMap.set(name, { value, isRoot: true });
      }
    }
  }

  const tokens: Token[] = [];
  tokenMap.forEach(({ value }, name) => {
    tokens.push({
      name,
      value,
      category: categorizeToken(name),
    });
  });

  // Sort by category then name
  const categoryOrder: TokenCategory[] = [
    "color", "typography", "spacing", "radius",
    "shadow", "border", "opacity", "transition",
  ];
  tokens.sort((a, b) => {
    const catDiff = categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
    if (catDiff !== 0) return catDiff;
    return a.name.localeCompare(b.name);
  });

  return {
    id: `extracted-${Date.now()}`,
    label: "Extracted",
    tokens,
    source: "extracted",
  };
}
