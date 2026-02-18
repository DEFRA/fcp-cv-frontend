import { TZDate } from '@date-fns/tz'
import { format } from 'date-fns'

export function screamingSnakeToTitleCase(input) {
  if (!input) return ''

  return input
    .replace(/_/g, ' ')
    .toLowerCase()
    .split(/\s+/)
    .map((word) => {
      if (word.length === 0) return ''
      return word[0].toUpperCase() + word.slice(1)
    })
    .join(' ')
}

export function formatDate(input) {
  return format(new TZDate(new Date(input), 'Europe/London'), 'dd/MM/yyyy')
}
