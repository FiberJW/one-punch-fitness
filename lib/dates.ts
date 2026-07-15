// Local calendar date as "YYYY-MM-DD" (matches the legacy Progenitor.dateString,
// which used the device's local Date fields — not UTC).
export function localDate(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}
