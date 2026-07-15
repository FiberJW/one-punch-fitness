import { formatLongDate, formatTime, localDate } from '@/lib/dates';

describe('localDate', () => {
  it('formats a date as local YYYY-MM-DD with zero padding', () => {
    expect(localDate(new Date(2026, 0, 5))).toBe('2026-01-05');
    expect(localDate(new Date(2026, 11, 31))).toBe('2026-12-31');
  });

  it('uses local calendar fields, not UTC', () => {
    // Build a date from local components; the string must echo those components.
    const d = new Date(2026, 6, 16, 23, 30);
    expect(localDate(d)).toBe('2026-07-16');
  });
});

describe('formatLongDate ordinals', () => {
  const cases: [string, string][] = [
    ['2026-07-01', 'July 1st, 2026'],
    ['2026-07-02', 'July 2nd, 2026'],
    ['2026-07-03', 'July 3rd, 2026'],
    ['2026-07-04', 'July 4th, 2026'],
    ['2026-07-11', 'July 11th, 2026'],
    ['2026-07-12', 'July 12th, 2026'],
    ['2026-07-13', 'July 13th, 2026'],
    ['2026-07-21', 'July 21st, 2026'],
    ['2026-07-22', 'July 22nd, 2026'],
    ['2026-07-23', 'July 23rd, 2026'],
    ['2026-07-31', 'July 31st, 2026'],
  ];

  it.each(cases)('formats %s as "%s"', (input, expected) => {
    expect(formatLongDate(input)).toBe(expected);
  });
});

describe('formatTime', () => {
  it('formats morning times as h:mmAM', () => {
    expect(formatTime(new Date(2026, 6, 16, 9, 5))).toBe('9:05AM');
  });

  it('formats afternoon times as h:mmPM in 12-hour form', () => {
    expect(formatTime(new Date(2026, 6, 16, 13, 30))).toBe('1:30PM');
  });

  it('renders midnight as 12:mmAM and noon as 12:mmPM', () => {
    expect(formatTime(new Date(2026, 6, 16, 0, 0))).toBe('12:00AM');
    expect(formatTime(new Date(2026, 6, 16, 12, 45))).toBe('12:45PM');
  });
});
