import { Token, TokenSet, TokenCategory } from "@/lib/types/token";

export type CombineRecipe = Record<string, string>; // category -> tokenSetId

export const TOKEN_CATEGORIES: TokenCategory[] = [
  "color",
  "typography",
  "spacing",
  "radius",
  "shadow",
  "border",
  "opacity",
  "transition",
];

export function combineTokenSets(
  recipe: CombineRecipe,
  tokenSets: Map<string, TokenSet>,
  baseTokens: TokenSet
): Token[] {
  return baseTokens.tokens.map((baseToken) => {
    const sourceId = recipe[baseToken.category];
    const sourceSet = sourceId ? tokenSets.get(sourceId) : undefined;

    if (sourceSet) {
      const sourceToken = sourceSet.tokens.find((t) => t.name === baseToken.name);
      return sourceToken ? { ...sourceToken } : { ...baseToken };
    }
    return { ...baseToken };
  });
}
