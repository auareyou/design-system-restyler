import { Token, TokenSet, TokenCategory } from "../types/token";

export interface TokenDiffEntry {
  name: string;
  category: TokenCategory;
  oldValue: string;
  newValue: string;
}

export interface TokenDiffResult {
  changed: TokenDiffEntry[];
  unchanged: Token[];
  byCategory: Record<string, { changed: TokenDiffEntry[]; unchanged: Token[] }>;
  totalChanged: number;
}

/**
 * Diff two token sets. Returns changed and unchanged tokens,
 * grouped by category.
 */
export function diffTokenSets(
  base: TokenSet,
  variation: TokenSet
): TokenDiffResult {
  const varMap = new Map(variation.tokens.map((t) => [t.name, t]));

  const changed: TokenDiffEntry[] = [];
  const unchanged: Token[] = [];

  base.tokens.forEach((baseToken) => {
    const varToken = varMap.get(baseToken.name);
    if (!varToken || varToken.value === baseToken.value) {
      unchanged.push(baseToken);
    } else {
      changed.push({
        name: baseToken.name,
        category: baseToken.category,
        oldValue: baseToken.value,
        newValue: varToken.value,
      });
    }
  });

  // Group by category
  const byCategory: Record<string, { changed: TokenDiffEntry[]; unchanged: Token[] }> = {};

  const allCategories = Array.from(
    new Set([
      ...changed.map((c) => c.category),
      ...unchanged.map((u) => u.category),
    ])
  );

  allCategories.forEach((cat) => {
    byCategory[cat] = {
      changed: changed.filter((c) => c.category === cat),
      unchanged: unchanged.filter((u) => u.category === cat),
    };
  });

  return { changed, unchanged, byCategory, totalChanged: changed.length };
}
