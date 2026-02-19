import { TZDate } from '@date-fns/tz'
import { describe, expect, it } from 'vitest'

import { formatDate, screamingSnakeToTitleCase } from '@/lib/formatters'

describe('screamingSnakeToTitleCase', () => {
  it('converts standard SCREAMING_SNAKE_CASE → Title Case', () => {
    expect(screamingSnakeToTitleCase('USER_FULL_NAME')).toBe('User Full Name')
    expect(screamingSnakeToTitleCase('CREATED_AT')).toBe('Created At')
    expect(screamingSnakeToTitleCase('VAT_NUMBER')).toBe('Vat Number')
  })

  it('handles single word', () => {
    expect(screamingSnakeToTitleCase('EMAIL')).toBe('Email')
    expect(screamingSnakeToTitleCase('ID')).toBe('Id')
    expect(screamingSnakeToTitleCase('T')).toBe('T')
  })

  it('handles multiple / consecutive underscores', () => {
    expect(screamingSnakeToTitleCase('START__END___TIME')).toBe(
      'Start End Time'
    )
    expect(screamingSnakeToTitleCase('___')).toBe('')
    expect(screamingSnakeToTitleCase('HELLO___WORLD__')).toBe('Hello World')
  })

  it('returns empty string for falsy / emptyish input', () => {
    expect(screamingSnakeToTitleCase('')).toBe('')
    expect(screamingSnakeToTitleCase(null)).toBe('')
    expect(screamingSnakeToTitleCase(undefined)).toBe('')
    expect(screamingSnakeToTitleCase(0)).toBe('')
  })

  it('handles already-lowercase input', () => {
    expect(screamingSnakeToTitleCase('user_full_name')).toBe('User Full Name')
    expect(screamingSnakeToTitleCase('created_at')).toBe('Created At')
  })

  it('preserves numbers and treats them as part of word', () => {
    expect(screamingSnakeToTitleCase('API_V2_KEY')).toBe('Api V2 Key')
    expect(screamingSnakeToTitleCase('USER_2FA_ENABLED')).toBe(
      'User 2fa Enabled'
    )
    expect(screamingSnakeToTitleCase('X_API_TOKEN_2FA')).toBe('X Api Token 2fa')
  })

  it('handles mixed case + numbers + special chars', () => {
    expect(screamingSnakeToTitleCase('HTTP_STATUS_429_TOO_MANY_REQUESTS')).toBe(
      'Http Status 429 Too Many Requests'
    )
    expect(screamingSnakeToTitleCase('AWS_S3_BUCKET_NAME_V2')).toBe(
      'Aws S3 Bucket Name V2'
    )
  })

  it('handles input with leading/trailing underscores', () => {
    expect(screamingSnakeToTitleCase('_DEBUG_MODE_')).toBe('Debug Mode')
    expect(screamingSnakeToTitleCase('__SECRET_KEY__')).toBe('Secret Key')
  })

  it('handles very short / single-letter words after split', () => {
    expect(screamingSnakeToTitleCase('A_B_C')).toBe('A B C')
    expect(screamingSnakeToTitleCase('X_Y_Z_1')).toBe('X Y Z 1')
  })
})

describe('formatDate', () => {
  const london = 'Europe/London'

  it('formats ISO strings (Z) correctly in Europe/London', () => {
    // Winter time (GMT)
    expect(formatDate('2025-01-15T23:30:00Z')).toBe('15/01/2025')

    // Summer time (BST = UTC+1)
    expect(formatDate('2025-07-10T22:59:59Z')).toBe('10/07/2025') // 23:59:59 BST
    expect(formatDate('2025-07-11T00:30:00Z')).toBe('11/07/2025') // 01:30:00 BST
  })

  it('correctly handles date-only strings (treated as local midnight)', () => {
    expect(formatDate('2024-12-01')).toBe('01/12/2024')
    expect(formatDate('2025-02-28')).toBe('28/02/2025')
    expect(formatDate('2024-02-29')).toBe('29/02/2024') // leap year
  })

  it('accepts native Date objects', () => {
    const d1 = new Date('2025-04-05T14:20:00Z')
    expect(formatDate(d1)).toBe('05/04/2025')

    const d2 = new Date(2025, 11, 25, 9, 30) // Dec 25 2025 ~ local time
    expect(formatDate(d2)).toBe('25/12/2025')
  })

  it('handles already TZDate instances', () => {
    const tz = new TZDate(new Date('2025-06-20T10:00:00Z'), london)
    expect(formatDate(tz)).toBe('20/06/2025')
  })

  it('handles various valid but unusual date inputs', () => {
    expect(formatDate('2025-12-31T23:59:59.999Z')).toBe('31/12/2025')
    expect(formatDate(new Date(0))).toBe('01/01/1970') // epoch
  })

  it('throws on clearly invalid date input', () => {
    expect(() => formatDate('invalid-date')).toThrow()
    expect(() => formatDate('2025-13-01')).toThrow() // invalid month
    expect(() => formatDate(NaN)).toThrow()
  })
})
