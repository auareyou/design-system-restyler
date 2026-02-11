export type TokenCategory =
  | "color"
  | "spacing"
  | "radius"
  | "shadow"
  | "typography"
  | "border"
  | "opacity"
  | "transition";

export interface Token {
  name: string;
  value: string;
  category: TokenCategory;
  computed?: string;
}

export interface TokenSet {
  id: string;
  label: string;
  tokens: Token[];
  source: "extracted" | "generated";
  direction?: string;
  parentId?: string;
}
