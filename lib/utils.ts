const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

// Only reject if we can confirm the article is older than 7 days.
// If there's no date, we can't tell — include it.
export function isNotOlderThanWeek(dateStr: string | undefined): boolean {
  if (!dateStr) return true
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return true
  return Date.now() - date.getTime() <= SEVEN_DAYS_MS
}
