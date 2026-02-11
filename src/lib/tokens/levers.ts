import { Token } from "@/lib/types/token";
import { parseColor, toColorString, adjustLightness, mixHue } from "./color-utils";

export interface LeverDef {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  apply: (tokens: Token[], value: number) => Token[];
}

// ─── Lever implementations ─────────────────────────────────────────

function isBackgroundToken(name: string): boolean {
  return /canvas|bg|background|surface|inset|overlay/i.test(name);
}

function isForegroundToken(name: string): boolean {
  return /fg|foreground|text|on-emphasis/i.test(name);
}

/**
 * Contrast: increase/decrease lightness distance between fg and bg colors.
 * value: -50 to +50 (0 = no change)
 */
const contrastLever: LeverDef = {
  id: "contrast",
  label: "Contrast",
  min: -50,
  max: 50,
  step: 1,
  defaultValue: 0,
  apply(tokens, value) {
    if (value === 0) return tokens;
    return tokens.map((t) => {
      if (t.category !== "color") return t;
      const hsl = parseColor(t.value);
      if (!hsl) return t;
      if (isBackgroundToken(t.name)) {
        // Push bg lighter or darker based on current lightness
        const dir = hsl.l > 50 ? 1 : -1;
        return { ...t, value: toColorString(adjustLightness(hsl, dir * value * 0.3)) };
      }
      if (isForegroundToken(t.name)) {
        const dir = hsl.l > 50 ? -1 : 1;
        return { ...t, value: toColorString(adjustLightness(hsl, dir * value * 0.3)) };
      }
      return t;
    });
  },
};

/**
 * Darkness: shift all canvas/bg tokens darker or lighter.
 * value: -50 to +50 (0 = no change, positive = darker, negative = lighter)
 */
const darknessLever: LeverDef = {
  id: "darkness",
  label: "Darkness",
  min: -50,
  max: 50,
  step: 1,
  defaultValue: 0,
  apply(tokens, value) {
    if (value === 0) return tokens;
    return tokens.map((t) => {
      if (t.category !== "color") return t;
      const hsl = parseColor(t.value);
      if (!hsl) return t;
      if (isBackgroundToken(t.name)) {
        return { ...t, value: toColorString(adjustLightness(hsl, -value * 0.5)) };
      }
      return t;
    });
  },
};

/**
 * Color tint: add a hue tint to all color tokens.
 * value: 0 to 360 (hue angle), default 0 = no tint
 */
const colorTintLever: LeverDef = {
  id: "colorTint",
  label: "Color Tint",
  min: 0,
  max: 360,
  step: 5,
  defaultValue: 0,
  apply(tokens, value) {
    if (value === 0) return tokens;
    return tokens.map((t) => {
      if (t.category !== "color") return t;
      const hsl = parseColor(t.value);
      if (!hsl) return t;
      return { ...t, value: toColorString(mixHue(hsl, value, 0.3)) };
    });
  },
};

/**
 * Depth: scale shadow values.
 * value: 0 to 200 (100 = no change, 0 = flat, 200 = extreme depth)
 */
const depthLever: LeverDef = {
  id: "depth",
  label: "Depth",
  min: 0,
  max: 200,
  step: 5,
  defaultValue: 100,
  apply(tokens, value) {
    if (value === 100) return tokens;
    const factor = value / 100;
    return tokens.map((t) => {
      if (t.category !== "shadow") return t;
      // Scale numeric values in shadow strings
      const scaled = t.value.replace(/(\d+(?:\.\d+)?)(px)/g, (_, num, unit) => {
        return `${Math.round(parseFloat(num) * factor)}${unit}`;
      });
      return { ...t, value: scaled };
    });
  },
};

/**
 * Roundness: scale border-radius tokens.
 * value: 0 to 200 (100 = no change, 0 = sharp, 200 = very round)
 */
const roundnessLever: LeverDef = {
  id: "roundness",
  label: "Roundness",
  min: 0,
  max: 200,
  step: 5,
  defaultValue: 100,
  apply(tokens, value) {
    if (value === 100) return tokens;
    const factor = value / 100;
    return tokens.map((t) => {
      if (t.category !== "radius") return t;
      const scaled = t.value.replace(/(\d+(?:\.\d+)?)(px)/g, (_, num, unit) => {
        return `${Math.round(parseFloat(num) * factor)}${unit}`;
      });
      return { ...t, value: scaled };
    });
  },
};

// ─── Lever registry ────────────────────────────────────────────────

export const ALL_LEVERS: LeverDef[] = [
  contrastLever,
  darknessLever,
  colorTintLever,
  depthLever,
  roundnessLever,
];

/**
 * Infer which levers to show based on the variation's prompt.
 */
export function inferLevers(prompt: string): LeverDef[] {
  const lower = prompt.toLowerCase();
  const levers: LeverDef[] = [];

  // Always show contrast and roundness
  levers.push(contrastLever, roundnessLever);

  if (/dark|night|dim/.test(lower)) {
    levers.push(darknessLever, colorTintLever);
  }
  if (/tint|color|blue|warm|cool|hue/.test(lower)) {
    if (!levers.includes(colorTintLever)) levers.push(colorTintLever);
  }
  if (/depth|shadow|skeuomorphic|3d|elevat/.test(lower)) {
    levers.push(depthLever);
  }
  if (/round|soft|pill/.test(lower)) {
    // roundness already included
  }

  // Always include depth as it's broadly useful
  if (!levers.includes(depthLever)) levers.push(depthLever);

  return levers;
}

/**
 * Apply all active levers in sequence to a base token set.
 */
export function applyLevers(
  tokens: Token[],
  levers: LeverDef[],
  values: Record<string, number>
): Token[] {
  let result = tokens;
  for (const lever of levers) {
    const val = values[lever.id] ?? lever.defaultValue;
    if (val !== lever.defaultValue) {
      result = lever.apply(result, val);
    }
  }
  return result;
}
