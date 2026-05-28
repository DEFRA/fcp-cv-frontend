import { describe, expect, it } from 'vitest'

import { extractOperationName } from '@/lib/metrics'

describe('extractOperationName', () => {
  it('returns the named query operation', () => {
    expect(
      extractOperationName(`#graphql
        query CVCountyParishHoldings($sbi: ID!) {
          business(sbi: $sbi) { name }
        }
      `)
    ).toBe('CVCountyParishHoldings')
  })

  it('returns the named mutation operation', () => {
    expect(extractOperationName(`mutation UpdateThing { thing }`)).toBe(
      'UpdateThing'
    )
  })

  it('returns undefined for an anonymous query', () => {
    expect(extractOperationName(`{ business { name } }`)).toBeUndefined()
  })
})
