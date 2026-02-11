import { Token, TokenSet } from "../types/token";

/**
 * Convert a TokenSet into a flat Record<string, string>
 * for use as inline CSS custom property overrides.
 */
export function tokenSetToStyleOverrides(
  tokenSet: TokenSet
): Record<string, string> {
  const overrides: Record<string, string> = {};
  for (const token of tokenSet.tokens) {
    overrides[token.name] = token.value;
  }
  return overrides;
}

/**
 * Convert a TokenSet to a CSS string with :root selector.
 */
export function tokenSetToCss(tokenSet: TokenSet): string {
  const lines = tokenSet.tokens.map(
    (t) => `  ${t.name}: ${t.value};`
  );
  return `:root {\n${lines.join("\n")}\n}`;
}

/**
 * Parse a CSS string of custom property declarations into Token[].
 */
export function cssToTokens(css: string): Token[] {
  const tokens: Token[] = [];
  const regex = /(--[\w-]+)\s*:\s*([^;]+);/g;
  let match;
  while ((match = regex.exec(css)) !== null) {
    tokens.push({
      name: match[1],
      value: match[2].trim(),
      category: "color", // will be properly categorized by the extractor
    });
  }
  return tokens;
}
