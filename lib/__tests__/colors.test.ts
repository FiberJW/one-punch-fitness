import { progressFill } from '@/lib/colors';

describe('progressFill', () => {
  it('starts at the panel surface (#1d1717) for 0% progress', () => {
    expect(progressFill(0).toLowerCase()).toBe('#1d1717');
  });

  it('returns the gloveRed K.O. fill (#e5484d) at 100%', () => {
    expect(progressFill(100).toLowerCase()).toBe('#e5484d');
  });

  it('interpolates panel -> heroYellow: each channel rises toward yellow as progress grows', () => {
    const channel = (hex: string, i: number) => parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16);
    const samples = [0, 25, 50, 75, 99].map((p) => progressFill(p));
    for (const i of [0, 1]) {
      // red and green climb from panel (29, 23) toward heroYellow (255, 201).
      for (let j = 1; j < samples.length; j++) {
        expect(channel(samples[j], i)).toBeGreaterThanOrEqual(channel(samples[j - 1], i));
      }
    }
  });

  it('clamps out-of-range input to the endpoints', () => {
    expect(progressFill(-50).toLowerCase()).toBe('#1d1717');
    expect(progressFill(150).toLowerCase()).toBe('#e5484d');
  });
});
