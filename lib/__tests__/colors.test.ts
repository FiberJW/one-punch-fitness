import { progressColor, relativeLuminance } from '@/lib/colors';

describe('progressColor', () => {
  it('starts at red (#FF5252) for 0% progress', () => {
    expect(progressColor(0).toLowerCase()).toBe('#ff5252');
  });

  it('ends at teal (#1DE9B6) for 100% progress', () => {
    expect(progressColor(100).toLowerCase()).toBe('#1de9b6');
  });

  it('passes through each interpolation stop at even thirds', () => {
    // t = (percent / 100) * 3, so the stops land at 0, 33.3, 66.6, 100.
    expect(progressColor(100 / 3).toLowerCase()).toBe('#ff4500'); // orangered
    expect(progressColor(200 / 3).toLowerCase()).toBe('#ffff00'); // yellow
  });

  it('clamps out-of-range input to the endpoints', () => {
    expect(progressColor(-50).toLowerCase()).toBe('#ff5252');
    expect(progressColor(150).toLowerCase()).toBe('#1de9b6');
  });

  it('the red channel decreases monotonically across the scale', () => {
    const redChannel = (hex: string) => parseInt(hex.slice(1, 3), 16);
    const reds = [0, 25, 50, 75, 100].map((p) => redChannel(progressColor(p)));
    for (let i = 1; i < reds.length; i++) {
      expect(reds[i]).toBeLessThanOrEqual(reds[i - 1]);
    }
  });
});

describe('relativeLuminance', () => {
  it('is 1 for white and 0 for black', () => {
    expect(relativeLuminance('#ffffff')).toBeCloseTo(1, 5);
    expect(relativeLuminance('#000000')).toBeCloseTo(0, 5);
  });

  it('drives the calendar text-color threshold: bright fills read dark, dark fills read light', () => {
    // Calendar picks dark text when luminance > 0.5, light text otherwise.
    const pickText = (hex: string) => (relativeLuminance(hex) > 0.5 ? 'dark' : 'light');
    expect(pickText(progressColor(100))).toBe('dark'); // bright teal
    expect(pickText(progressColor(0))).toBe('light'); // red
  });
});
