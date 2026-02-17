import { vi } from 'vitest'
import { render } from 'vitest-browser-react'

import { notification } from '@/components/notification/Notifications'
import RootLayout from './layout.jsx'

describe('RootLayout component tests', () => {
  beforeAll(() => {
    vi.mock('@/config', () => {
      return {
        config: {
          get: () => 'http://localhost:3000'
        }
      }
    })
  })

  it('renders the RootLayout component with children', async () => {
    const { getByText } = await render(
      <RootLayout>
        <div>Test child content</div>
      </RootLayout>
    )

    await expect.element(getByText('Test child content')).toBeInTheDocument()

    notification('Test notification in RootLayout')
    await expect
      .element(getByText('Test notification in RootLayout'))
      .toBeInTheDocument()
  })
})
