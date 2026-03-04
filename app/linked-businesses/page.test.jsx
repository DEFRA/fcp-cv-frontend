import { AuthProvider } from '@/components/auth/auth-provider'
import { http, HttpResponse } from 'msw'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { testWithWorker } from '../../test/test-with-worker'
import Page from './page.jsx'

describe('Linked Businesses page tests', () => {
  testWithWorker(
    'renders the page component with content',
    async ({ worker }) => {
      worker.use(
        http.get(
          '/api/dataverse/contact/8b725f88-1562-4d4c-8c21-c185e46fa56c',
          () => HttpResponse.json({ crn: '12345678' })
        ),
        http.get('/api/dal/linked-businesses/list/12345678', () =>
          HttpResponse.json([
            { sbi: '1111111111', name: 'Business Name One' },
            { sbi: '2222222222', name: 'Business Name Two' }
          ])
        ),
        http.get('/api/dal/linked-businesses/details/12345678/1111111111', () =>
          HttpResponse.json({
            name: 'Business Name One',
            details: [
              { dt: 'SBI', dd: '1111111111' },
              { dt: 'Role', dd: 'Business Partner' }
            ],
            permissions: [
              {
                dt: 'Permission Title',
                dd: 'Permission Description',
                expand: ['Permission Function']
              }
            ]
          })
        ),
        http.get('/api/dal/linked-businesses/details/12345678/2222222222', () =>
          HttpResponse.json({})
        )
      )

      // Params that are set by CRM
      window.history.pushState(
        null,
        '',
        `?id=8b725f88-1562-4d4c-8c21-c185e46fa56c&typename=contact`
      )

      const { getByRole, getByText, getByPlaceholder } = await render(
        <AuthProvider config={{ disabled: true }}>
          <Page />
        </AuthProvider>
      )

      await expect
        .element(getByRole('heading', { name: 'Linked Businesses' }))
        .toBeInTheDocument()

      // Table present with correct columns
      await expect.element(getByRole('table')).toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: 'SBI' }))
        .toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: 'Name' }))
        .toBeInTheDocument()

      // Click a row
      await getByText('1111111111').click()

      // Click to expand permission
      await getByRole('button', {
        name: 'Permission Description'
      }).click()
      await expect.element(getByText('Permission Function')).toBeInTheDocument()

      // Search for an item
      await userEvent.type(getByPlaceholder('Enter search term'), '2222222222')

      // Click result
      await getByText('2222222222').click()

      // Clear result
      await getByRole('button', { name: 'Clear search' }).click()
    }
  )
})
