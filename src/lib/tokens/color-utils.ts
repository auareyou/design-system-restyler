export interface HSL {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
  a: number; // 0-1
}

/**
 * Parse a CSS color string (hex, rgb, rgba, hsl) into HSL.
 * Returns null if parsing fails.
 */
export function parseColor(value: string): HSL | null {
  const trimmed = value.trim();

  // Hex: #fff, #ffffff, #ffffffaa
  if (trimmed.startsWith("#")) {
    return hexToHsl(trimmed);
  }

  // rgba(r, g, b, a) or rgb(r, g, b)
  const rgbMatch = trimmed.match(
    /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/
  );
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]) / 255;
    const g = parseInt(rgbMatch[2]) / 255;
    const b = parseInt(rgbMatch[3]) / 255;
    const a = rgbMatch[4] !== undefined ? parseFloat(rgbMatch[4]) : 1;
    return rgbToHsl(r, g, b, a);
  }

  // hsl(h, s%, l%) or hsla(h, s%, l%, a)
  const hslMatch = trimmed.match(
    /hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%(?:\s*,\s*([\d.]+))?\s*\)/
  );
  if (hslMatch) {
    return {
      h: parseFloat(hslMatch[1]),
      s: parseFloat(hslMatch[2]),
      l: parseFloat(hslMatch[3]),
      a: hslMatch[4] !== undefined ? parseFloat(hslMatch[4]) : 1,
    };
  }

  return null;
}

function hexToHsl(hex: string): HSL | null {
  let h = hex.slice(1);
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  if (h.length !== 6 && h.length !== 8) return null;

  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;

  return rgbToHsl(r, g, b, a);
}

function rgbToHsl(r: number, g: number, b: number, a: number): HSL {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) {
    return { h: 0, s: 0, l: l * 100, a };
  }

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let hue = 0;
  if (max === r) hue = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) hue = ((b - r) / d + 2) / 6;
  else hue = ((r - g) / d + 4) / 6;

  return { h: hue * 360, s: s * 100, l: l * 100, a };
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const sn = s / 100;
  const ln = l / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = ln - c / 2;

  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }

  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
}

/**
 * Convert HSL back to a CSS color string.
 */
export function toColorString(hsl: HSL): string {
  const [r, g, b] = hslToRgb(hsl.h, hsl.s, hsl.l);
  if (hsl.a < 1) {
    return `rgba(${r}, ${g}, ${b}, ${Math.round(hsl.a * 100) / 100})`;
  }
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

/**
 * Adjust lightness by a relative amount (-100 to +100).
 */
export function adjustLightness(hsl: HSL, amount: number): HSL {
  return {
    ...hsl,
    l: Math.max(0, Math.min(100, hsl.l + amount)),
  };
}

/**
 * Mix a hue tint into a color.
 * ratio: 0 = no change, 1 = fully tinted.
 */
export function mixHue(hsl: HSL, targetHue: number, ratio: number): HSL {
  if (hsl.s < 3) return hsl; // Skip near-grayscale
  const diff = targetHue - hsl.h;
  return {
    ...hsl,
    h: (hsl.h + diff * ratio + 360) % 360,
    s: Math.min(100, hsl.s + ratio * 10),
  };
}
