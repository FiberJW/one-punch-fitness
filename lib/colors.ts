// Tiny color helpers for the calendar progress markers (no chroma-js dep).
// Replaces the legacy Chroma.scale([bRED, orangered, yellow, start]) usage.

// RGB stops the progress color interpolates across: red -> orangered -> yellow -> teal.
const STOPS: [number, number, number][] = [
  [0xff, 0x52, 0x52], // #FF5252 (bRED)
  [0xff, 0x45, 0x00], // orangered
  [0xff, 0xff, 0x00], // yellow
  [0x1d, 0xe9, 0xb6], // #1DE9B6 (start)
];

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

const toHex = (n: number) => Math.round(n).toString(16).padStart(2, '0');

// Linear RGB interpolation across STOPS for a 0..100 percentage.
export function progressColor(percent: number): string {
  const t = clamp01(percent / 100) * (STOPS.length - 1);
  const i = Math.min(STOPS.length - 2, Math.floor(t));
  const f = t - i;
  const [r1, g1, b1] = STOPS[i];
  const [r2, g2, b2] = STOPS[i + 1];
  const r = r1 + (r2 - r1) * f;
  const g = g1 + (g2 - g1) * f;
  const b = b1 + (b2 - b1) * f;
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// WCAG relative luminance of a #rrggbb color, 0..1.
export function relativeLuminance(hex: string): number {
  const int = parseInt(hex.slice(1), 16);
  const channels = [(int >> 16) & 0xff, (int >> 8) & 0xff, int & 0xff].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}
