// Progress fill for the calendar day markers: quiet panel surface climbing to
// heroYellow as the day fills in, with the fully-complete "K.O." day in gloveRed.
import { colors } from '@/constants/colors';

const PANEL: [number, number, number] = [0x1d, 0x17, 0x17]; // colors.panel
const HERO: [number, number, number] = [0xff, 0xc9, 0x3c]; // colors.heroYellow

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const toHex = (n: number) => Math.round(n).toString(16).padStart(2, '0');

// 0..100 percentage -> hex fill. 100% is the gloveRed K.O. day; below that the
// color interpolates linearly from panel toward heroYellow.
export function progressFill(percent: number): string {
  if (percent >= 100) return colors.gloveRed;
  const f = clamp01(percent / 100);
  const r = PANEL[0] + (HERO[0] - PANEL[0]) * f;
  const g = PANEL[1] + (HERO[1] - PANEL[1]) * f;
  const b = PANEL[2] + (HERO[2] - PANEL[2]) * f;
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
