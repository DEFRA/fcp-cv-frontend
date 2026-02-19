import { useSearchParams } from 'next/navigation'
import { render } from 'vitest-browser-react'

import { useDal } from '@/hooks/data'
import { LinkedContactsDetails } from './linked-contacts-details'

describe('LinkedContactsDetails tests', () => {
  beforeAll(() => {
    vi.mock('next/navigation', () => ({
      useSearchParams: vi.fn()
    }))
    vi.mock('@/hooks/data', () => ({
      useDal: vi.fn(),
      useDataverse: () => ({ data: [] })
    }))
  })

  it('renders "Select a contact" when no CRN in params', async () => {
    useSearchParams.mockReturnValue(new URLSearchParams())
    useDal.mockReturnValue(() => ({
      data: []
    }))

    const { getByText } = await render(<LinkedContactsDetails />)
    await expect
      .element(getByText('Select a contact from the table'))
      .toBeInTheDocument()
  })

  it('renders contact details', async () => {
    useSearchParams.mockReturnValue(new URLSearchParams({ crn: 'crn1' }))
    useDal.mockReturnValue({ data: null })

    const { getByText } = await render(<LinkedContactsDetails />)

    await expect.element(getByText('displayName')).not.toBeInTheDocument()
  })

  it('renders contact details', async () => {
    useSearchParams.mockReturnValue(new URLSearchParams({ crn: 'crn1' }))
    useDal.mockReturnValue({
      data: {
        displayName: 'displayName',
        details: [{ dt: 'detailsDt', dd: 'detailsDd' }],
        permissions: [
          {
            dt: 'permissionDt',
            dd: 'permissionDd',
            expand: ['expand1', 'expand2']
          }
        ]
      }
    })

    const { getByText } = await render(<LinkedContactsDetails />)

    await expect.element(getByText('displayName')).toBeInTheDocument()
  })
})
