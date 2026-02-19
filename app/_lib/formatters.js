import { TZDate } from '@date-fns/tz'
import { format } from 'date-fns'

export function screamingSnakeToTitleCase(input) {
  // Handle falsy / empty / non-string early
  if (!input || typeof input !== 'string') {
    return ''
  }

  // Replace any sequence of underscores (one or more) with a single space
  const withSpaces = input.replace(/_+/g, ' ').trim()

  // If after cleaning we have nothing left, return empty string
  if (!withSpaces) {
    return ''
  }

  return withSpaces
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}

export function formatDate(input) {
  return format(new TZDate(new Date(input), 'Europe/London'), 'dd/MM/yyyy')
}
