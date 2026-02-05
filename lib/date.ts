/**
 * Parsea una fecha solo-día (YYYY-MM-DD) como fecha local a medianoche.
 * Evita el desfase de un día que ocurre con new Date("YYYY-MM-DD") (que se interpreta como UTC).
 */
export function parseLocalDate(dateString: string): Date {
  if (!dateString || typeof dateString !== 'string') return new Date(NaN)
  const trimmed = dateString.trim()
  const match = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)
  if (match) {
    const year = parseInt(match[1], 10)
    const month = parseInt(match[2], 10) - 1
    const day = parseInt(match[3], 10)
    const date = new Date(year, month, day)
    if (!isNaN(date.getTime())) return date
  }
  return new Date(trimmed)
}
