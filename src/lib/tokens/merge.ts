import { Token } from "@/lib/types/token";

export function mergeTokens(base: Token[], overrides: Token[]): Token[] {
  const overrideMap = new Map(overrides.map((t) => [t.name, t.value]));
  return base.map((token) => ({
    ...token,
    value: overrideMap.get(token.name) ?? token.value,
  }));
}
