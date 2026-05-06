import { TZDate } from '@date-fns/tz'
import { describe, expect, it } from 'vitest'

import {
  formatCurrency,
  formatDate,
  formatDateAndTime,
  uppercaseSnakeToTitleCase
} from '@/lib/formatters'

describe('screamingSnakeToTitleCase', () => {
  it('converts standard SCREAMING_SNAKE_CASE → Title Case', () => {
    expect(uppercaseSnakeToTitleCase('USER_FULL_NAME')).toBe('User Full Name')
    expect(uppercaseSnakeToTitleCase('CREATED_AT')).toBe('Created At')
    expect(uppercaseSnakeToTitleCase('VAT_NUMBER')).toBe('Vat Number')
  })

  it('handles single word', () => {
    expect(uppercaseSnakeToTitleCase('EMAIL')).toBe('Email')
    expect(uppercaseSnakeToTitleCase('ID')).toBe('Id')
    expect(uppercaseSnakeToTitleCase('T')).toBe('T')
  })

  it('handles multiple / consecutive underscores', () => {
    expect(uppercaseSnakeToTitleCase('START__END___TIME')).toBe(
      'Start End Time'
    )
    expect(uppercaseSnakeToTitleCase('___')).toBe('')
    expect(uppercaseSnakeToTitleCase('HELLO___WORLD__')).toBe('Hello World')
  })

  it('returns empty string for falsy / emptyish input', () => {
    expect(uppercaseSnakeToTitleCase('')).toBe('')
    expect(uppercaseSnakeToTitleCase(null)).toBe('')
    expect(uppercaseSnakeToTitleCase(undefined)).toBe('')
    expect(uppercaseSnakeToTitleCase(0)).toBe('')
  })

  it('handles already-lowercase input', () => {
    expect(uppercaseSnakeToTitleCase('user_full_name')).toBe('User Full Name')
    expect(uppercaseSnakeToTitleCase('created_at')).toBe('Created At')
  })

  it('preserves numbers and treats them as part of word', () => {
    expect(uppercaseSnakeToTitleCase('API_V2_KEY')).toBe('Api V2 Key')
    expect(uppercaseSnakeToTitleCase('USER_2FA_ENABLED')).toBe(
      'User 2fa Enabled'
    )
    expect(uppercaseSnakeToTitleCase('X_API_TOKEN_2FA')).toBe('X Api Token 2fa')
  })

  it('handles mixed case + numbers + special chars', () => {
    expect(uppercaseSnakeToTitleCase('HTTP_STATUS_429_TOO_MANY_REQUESTS')).toBe(
      'Http Status 429 Too Many Requests'
    )
    expect(uppercaseSnakeToTitleCase('AWS_S3_BUCKET_NAME_V2')).toBe(
      'Aws S3 Bucket Name V2'
    )
  })

  it('handles input with leading/trailing underscores', () => {
    expect(uppercaseSnakeToTitleCase('_DEBUG_MODE_')).toBe('Debug Mode')
    expect(uppercaseSnakeToTitleCase('__SECRET_KEY__')).toBe('Secret Key')
  })

  it('handles very short / single-letter words after split', () => {
    expect(uppercaseSnakeToTitleCase('A_B_C')).toBe('A B C')
    expect(uppercaseSnakeToTitleCase('X_Y_Z_1')).toBe('X Y Z 1')
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

  it('returns empty string for null or undefined', () => {
    expect(formatDate(null)).toBe('')
    expect(formatDate(undefined)).toBe('')
  })

  it('returns custom defaultReturnValue when input is null or undefined', () => {
    expect(formatDate(null, 'N/A')).toBe('N/A')
    expect(formatDate(undefined, 'N/A')).toBe('N/A')
  })
})

describe('formatDateAndTime', () => {
  const london = 'Europe/London'

  it('formats ISO strings (Z) correctly in Europe/London', () => {
    // Winter time (GMT)
    expect(formatDateAndTime('2025-01-15T23:30:00Z')).toBe('15/01/2025 23:30')

    // Summer time (BST = UTC+1)
    expect(formatDateAndTime('2025-07-10T22:59:59Z')).toBe('10/07/2025 23:59')
    expect(formatDateAndTime('2025-07-11T00:30:00Z')).toBe('11/07/2025 01:30')
  })

  it('accepts native Date objects', () => {
    const d = new Date('2025-04-05T14:20:00Z')
    expect(formatDateAndTime(d)).toBe('05/04/2025 15:20') // BST = UTC+1
  })

  it('handles already TZDate instances', () => {
    const tz = new TZDate(new Date('2025-06-20T10:00:00Z'), london)
    expect(formatDateAndTime(tz)).toBe('20/06/2025 11:00') // BST = UTC+1
  })

  it('throws on clearly invalid date input', () => {
    expect(() => formatDateAndTime('invalid-date')).toThrow()
    expect(() => formatDateAndTime(NaN)).toThrow()
  })

  it('returns empty string for null or undefined', () => {
    expect(formatDateAndTime(null)).toBe('')
    expect(formatDateAndTime(undefined)).toBe('')
  })

  it('returns custom defaultReturnValue when input is null or undefined', () => {
    expect(formatDateAndTime(null, 'N/A')).toBe('N/A')
    expect(formatDateAndTime(undefined, 'N/A')).toBe('N/A')
  })
})

describe('formatCurrency', () => {
  it('formats whole numbers with two decimal places and GBP suffix', () => {
    expect(formatCurrency(1000)).toBe('1,000.00 GBP')
    expect(formatCurrency(0)).toBe('0.00 GBP')
    expect(formatCurrency(1)).toBe('1.00 GBP')
  })

  it('formats decimal amounts to exactly two decimal places', () => {
    expect(formatCurrency(750.5)).toBe('750.50 GBP')
    expect(formatCurrency(1234.99)).toBe('1,234.99 GBP')
    expect(formatCurrency(0.1)).toBe('0.10 GBP')
  })

  it('uses thousands separators for large amounts', () => {
    expect(formatCurrency(1000000)).toBe('1,000,000.00 GBP')
    expect(formatCurrency(12345678.9)).toBe('12,345,678.90 GBP')
  })

  it('formats negative amounts', () => {
    expect(formatCurrency(-500)).toBe('-500.00 GBP')
    expect(formatCurrency(-1234.56)).toBe('-1,234.56 GBP')
  })
})
