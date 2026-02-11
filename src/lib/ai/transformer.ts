import Anthropic from "@anthropic-ai/sdk";
import { Token, TokenSet } from "../types/token";
import { buildTransformPrompt } from "./prompts";

const MODEL = "claude-sonnet-4-20250514";

/**
 * Call Claude to transform a token set based on a natural language direction.
 * Returns a new TokenSet with transformed values.
 */
export async function transformTokens(
  apiKey: string,
  baseTokens: TokenSet,
  direction: string,
  brandContext?: string
): Promise<TokenSet> {
  const client = new Anthropic({ apiKey });

  const prompt = buildTransformPrompt(baseTokens, direction, brandContext);

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  // Extract text from response
  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Claude");
  }

  const raw = textBlock.text.trim();

  // Parse JSON — strip markdown fences if present
  let jsonStr = raw;
  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    jsonStr = fenceMatch[1].trim();
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    throw new Error(`Failed to parse Claude response as JSON: ${raw.slice(0, 200)}`);
  }

  if (!Array.isArray(parsed)) {
    throw new Error("Claude response is not a JSON array");
  }

  // Validate: every original token name must be present
  const baseNames = new Set(baseTokens.tokens.map((t) => t.name));
  const transformedTokens: Token[] = [];

  for (const item of parsed) {
    if (
      typeof item !== "object" ||
      item === null ||
      typeof item.name !== "string" ||
      typeof item.value !== "string" ||
      typeof item.category !== "string"
    ) {
      continue; // skip malformed entries
    }

    // Only keep tokens that exist in the base set
    if (baseNames.has(item.name)) {
      transformedTokens.push({
        name: item.name,
        value: item.value,
        category: item.category,
      });
      baseNames.delete(item.name);
    }
  }

  // Fill in any missing tokens with base values
  if (baseNames.size > 0) {
    const baseMap = new Map(baseTokens.tokens.map((t) => [t.name, t]));
    baseNames.forEach((name) => {
      const original = baseMap.get(name);
      if (original) {
        transformedTokens.push({ ...original });
      }
    });
  }

  // Sort to match original order
  const orderMap = new Map(baseTokens.tokens.map((t, i) => [t.name, i]));
  transformedTokens.sort(
    (a, b) => (orderMap.get(a.name) ?? 999) - (orderMap.get(b.name) ?? 999)
  );

  const id = `tokens-ai-${Date.now()}`;
  return {
    id,
    label: direction.length > 40 ? direction.slice(0, 40) + "..." : direction,
    tokens: transformedTokens,
    source: "generated",
    direction,
    parentId: baseTokens.id,
  };
}
