import { AuthProvider } from '@/components/auth/auth-provider'
import { http, HttpResponse } from 'msw'
import { render } from 'vitest-browser-react'
import { testWithWorker } from '../../test/test-with-worker'
import Page from './page.jsx'

describe('Authenticate page tests', () => {
  beforeAll(() => {
    vi.mock('@/config', () => ({
      config: { get: () => 'error' } // quiet logs in test
    }))
  })

  testWithWorker(
    'renders the page component with content',
    async ({ worker }) => {
      worker.use(
        http.get(
          '/api/dataverse/contact/8b725f88-1562-4d4c-8c21-c185e46fa56c',
          () => HttpResponse.json({ crn: '12345678' })
        ),
        http.get('/api/dal/authenticate/12345678', () =>
          HttpResponse.json([
            {
              dd: '01/01/2000',
              dt: 'Memorable Date'
            },
            {
              dd: 'Stoltenberg-under-Bechtelar',
              dt: 'Memorable Location'
            },
            {
              dd: 'aureus',
              dt: 'Memorable Event'
            },
            {
              dd: '02/02/2000',
              dt: 'Updated At'
            }
          ])
        )
      )

      // Params that are set by CRM
      window.history.pushState(
        null,
        '',
        `?id=8b725f88-1562-4d4c-8c21-c185e46fa56c&typename=contact`
      )

      const { getByRole, getByText } = await render(
        <AuthProvider config={{ disabled: true }}>
          <Page />
        </AuthProvider>
      )

      await expect
        .element(getByRole('heading', { name: 'Memorable questions' }))
        .toBeInTheDocument()

      await expect
        .element(getByText('Memorable Date' + '01/01/2000'))
        .toBeInTheDocument()

      await expect
        .element(
          getByText('Memorable Location' + 'Stoltenberg-under-Bechtelar')
        )
        .toBeInTheDocument()
      await expect
        .element(getByText('Stoltenberg-under-Bechtelar'))
        .toBeInTheDocument()

      await expect
        .element(getByText('Memorable Event' + 'aureus'))
        .toBeInTheDocument()

      await expect
        .element(getByText('Updated At' + '02/02/2000'))
        .toBeInTheDocument()
    }
  )
})
