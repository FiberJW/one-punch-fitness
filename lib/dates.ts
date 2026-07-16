// Local calendar date as "YYYY-MM-DD" (matches the legacy Progenitor.dateString,
// which used the device's local Date fields — not UTC).
export function localDate(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Monday-based ISO week start for a "YYYY-MM-DD" date, returned as "YYYY-MM-DD".
// Two dates share a week iff their isoWeekStart values are equal.
export function isoWeekStart(dateString: string): string {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const daysSinceMonday = (date.getDay() + 6) % 7; // getDay: 0=Sun..6=Sat
  date.setDate(date.getDate() - daysSinceMonday);
  return localDate(date);
}

function ordinal(day: number): string {
  if (day >= 11 && day <= 13) return `${day}th`;
  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
}

// "YYYY-MM-DD" -> "July 16th, 2026" (replaces the legacy Moment "MMMM Do, YYYY").
export function formatLongDate(dateString: string): string {
  const [year, month, day] = dateString.split('-').map(Number);
  const monthName = new Date(year, month - 1, day).toLocaleString('en-US', { month: 'long' });
  return `${monthName} ${ordinal(day)}, ${year}`;
}

// Local wall-clock time as "h:mmA", e.g. "9:05AM" (replaces the legacy Moment "h:mmA").
export function formatTime(date: Date): string {
  const hours24 = date.getHours();
  const period = hours24 < 12 ? 'AM' : 'PM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${hours12}:${`${date.getMinutes()}`.padStart(2, '0')}${period}`;
}
