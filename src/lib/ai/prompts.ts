import { TokenSet } from "../types/token";

export function buildTransformPrompt(
  tokens: TokenSet,
  direction: string,
  brandContext?: string
): string {
  return `You are a visual design system expert. You're given a set of design tokens (CSS custom properties) from an existing design system, and a visual direction to apply.

Your job: return a modified token set that transforms the visual appearance according to the direction while maintaining internal consistency.

## Rules
- Keep the same token names. Only change values.
- Maintain WCAG AA contrast ratios (4.5:1 for text on backgrounds, 3:1 for UI elements).
- Preserve semantic relationships: primary should still feel "primary", danger should still feel "danger", success should still feel "success", etc.
- Spacing and typography scales should remain proportional unless the direction explicitly calls for a change.
- Keep subtle/muted variants lower-contrast than emphasis variants.
- Canvas tokens form the background hierarchy: default > subtle > inset. Maintain this ordering.
- Button tokens should remain internally consistent: primary bg needs sufficient contrast with primary text.
- If the direction is vague ("more expressive"), interpret it through: increased color saturation, more varied border-radius, more prominent shadows, bolder weight choices.
- If the direction implies dark mode: invert the canvas hierarchy, adjust all foreground colors for dark backgrounds, reduce shadow opacity, shift accent colors to lighter/brighter variants.
- Border colors should remain visible but not dominant against their adjacent canvas colors.

## Current Tokens
\`\`\`json
${JSON.stringify(tokens.tokens, null, 2)}
\`\`\`

## Visual Direction
${direction}
${brandContext ? `\n## Brand Context\n${brandContext}` : ""}

## Output Format
Return ONLY a JSON array of token objects. Each object must have exactly these fields: "name" (string), "value" (string), "category" (string).
Every token from the input must appear in the output — do not add or remove tokens.
Do not include any explanation, markdown fences, or text outside the JSON array.`;
}
