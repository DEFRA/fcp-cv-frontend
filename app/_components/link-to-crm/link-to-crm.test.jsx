import { vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { LinkToCRMAccount, LinkToCRMContact } from './link-to-crm'

describe('LinkToCRM component tests', () => {
  let mockParentLocationHref
  let originalParent

  beforeAll(() => {
    vi.mock('@/hooks/data', () => ({
      useDataverse: vi.fn()
    }))

    mockParentLocationHref = vi.fn()
    originalParent = window.parent
    window.parent = {
      location: {
        set href(value) {
          mockParentLocationHref(value)
        }
      }
    }
  })

  afterAll(() => {
    window.parent = originalParent
  })

  it('renders LinkToCRMContact with correct button text', async () => {
    const { useDataverse } = await import('@/hooks/data')

    vi.mocked(useDataverse).mockReturnValue({ data: null, isLoading: false })

    const { getByText } = await render(<LinkToCRMContact crn="123456789" />)

    await expect.element(getByText('View Contact')).toBeInTheDocument()
  })

  it('renders LinkToCRMAccount with correct button text', async () => {
    const { useDataverse } = await import('@/hooks/data')

    vi.mocked(useDataverse).mockReturnValue({ data: null, isLoading: false })

    const { getByText } = await render(<LinkToCRMAccount sbi="123456789" />)

    await expect.element(getByText('View Business')).toBeInTheDocument()
  })

  it('navigates parent frame to CRM URL when data loads', async () => {
    const { useDataverse } = await import('@/hooks/data')

    vi.mocked(useDataverse).mockReturnValue({
      data: { url: 'https://crm.test' },
      isLoading: false
    })

    await render(<LinkToCRMContact crn="123456789" />)

    expect(mockParentLocationHref).toHaveBeenCalledWith('https://crm.test')
  })

  it('navigates parent frame on button click when data is available', async () => {
    const { useDataverse } = await import('@/hooks/data')

    vi.mocked(useDataverse).mockReturnValue({
      data: { url: 'https://crm.test' },
      isLoading: false
    })

    const { getByText } = await render(<LinkToCRMContact crn="123456789" />)

    await getByText('View Contact').click()

    expect(mockParentLocationHref).toHaveBeenCalledTimes(2)
  })

  it('does not navigate parent frame on click when no data', async () => {
    const { useDataverse } = await import('@/hooks/data')

    vi.mocked(useDataverse).mockReturnValue({ data: null, isLoading: false })

    const { getByText } = await render(<LinkToCRMContact crn="123456789" />)

    await getByText('View Contact').click()

    expect(mockParentLocationHref).not.toHaveBeenCalled()
  })
})
