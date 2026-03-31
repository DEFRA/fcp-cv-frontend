import { render } from 'vitest-browser-react'

import { notification } from '@/components/notification/Notifications'
import RootLayout from './layout.jsx'

vi.mock('@defra/hapi-tracing', () => ({
  getTraceId: () => 'some-long-uuid-string'
}))

describe('RootLayout component tests', () => {
  beforeAll(() => {
    vi.mock('@/config', () => ({
      config: {
        get: (key) => {
          switch (key) {
            case 'LOG_LEVEL':
              return 'error'
            case 'DAL_URL':
              return 'http://localhost:3000'
          }
        }
      }
    }))
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
