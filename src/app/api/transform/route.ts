import { NextRequest, NextResponse } from "next/server";
import { transformTokens } from "@/lib/ai/transformer";
import { TokenSet } from "@/lib/types/token";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { baseTokens, direction, brandContext, apiKey } = body as {
      baseTokens: TokenSet;
      direction: string;
      brandContext?: string;
      apiKey?: string;
    };

    if (!baseTokens || !direction) {
      return NextResponse.json(
        { error: "Missing required fields: baseTokens, direction" },
        { status: 400 }
      );
    }

    // API key: prefer request body, fall back to env
    const key = apiKey || process.env.ANTHROPIC_API_KEY;
    if (!key) {
      return NextResponse.json(
        { error: "No API key provided. Set ANTHROPIC_API_KEY or pass apiKey in the request." },
        { status: 401 }
      );
    }

    const result = await transformTokens(key, baseTokens, direction, brandContext);

    return NextResponse.json({ variation: result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Transform error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
