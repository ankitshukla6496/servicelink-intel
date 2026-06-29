const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

export function isWithinLastWeek(dateStr: string | undefined): boolean {
  if (!dateStr) return false
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return false
  return Date.now() - date.getTime() <= SEVEN_DAYS_MS
}
