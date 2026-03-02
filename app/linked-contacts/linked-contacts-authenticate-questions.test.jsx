import { useSearchParams } from 'next/navigation'
import { render } from 'vitest-browser-react'

import { useDal } from '@/hooks/data'
import { LinkedContactsAuthenticateQuestions } from './linked-contacts-authenticate-questions'

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

  it('renders "View Authenticate Questions" button', async () => {
    useSearchParams.mockReturnValue(new URLSearchParams())
    useDal.mockReturnValue({
      data: []
    })

    const { getByText } = await render(<LinkedContactsAuthenticateQuestions />)
    await expect
      .element(getByText('View Authenticate Questions'))
      .toBeInTheDocument()
  })

  it('renders loading on click', async () => {
    useSearchParams.mockReturnValue(new URLSearchParams())
    useDal.mockReturnValue({
      data: null,
      isLoading: true
    })

    const { getByText } = await render(<LinkedContactsAuthenticateQuestions />)

    await getByText('View Authenticate Questions').click()

    await expect.element(getByText('Date of Birth')).toBeInTheDocument()
    await expect.element(getByText('Memorable Date')).toBeInTheDocument()
    await expect.element(getByText('Memorable Location')).toBeInTheDocument()
    await expect.element(getByText('Memorable Event')).toBeInTheDocument()
    await expect.element(getByText('Updated at')).toBeInTheDocument()
  })

  it('renders questions on click', async () => {
    useSearchParams.mockReturnValue(new URLSearchParams())
    useDal.mockReturnValue({
      data: {
        items: [
          { dt: 'Date of Birth', dd: '01/01/2025' },
          { dt: 'Memorable Date', dd: '11/19/2024' },
          { dt: 'Memorable Location', dd: 'memorableLocation' },
          { dt: 'Memorable Event', dd: 'memorableEvent' },
          { dt: 'Updated at', dd: '31/12/2024' }
        ]
      }
    })

    const { getByText } = await render(<LinkedContactsAuthenticateQuestions />)

    await getByText('View Authenticate Questions').click()

    await expect.element(getByText('Date of Birth')).toBeInTheDocument()
    await expect.element(getByText('01/01/2025')).toBeInTheDocument()

    await expect.element(getByText('Memorable Date')).toBeInTheDocument()
    await expect.element(getByText('11/19/2024')).toBeInTheDocument()

    await expect.element(getByText('Memorable Location')).toBeInTheDocument()
    await expect.element(getByText('memorableLocation')).toBeInTheDocument()

    await expect.element(getByText('Memorable Event')).toBeInTheDocument()
    await expect.element(getByText('memorableEvent')).toBeInTheDocument()

    await expect.element(getByText('Updated at')).toBeInTheDocument()
    await expect.element(getByText('31/12/2024')).toBeInTheDocument()
  })
})
