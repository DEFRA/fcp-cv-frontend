import { AuthProvider } from '@/components/auth/auth-provider'
import { http, HttpResponse } from 'msw'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { testWithWorker } from '../../test/test-with-worker'
import Page from './page.jsx'

describe('Linked Contacts page tests', () => {
  testWithWorker(
    'renders the page component with content',
    async ({ worker }) => {
      worker.use(
        http.get(
          '/api/dataverse/account/8b725f88-1562-4d4c-8c21-c185e46fa56c',
          () => HttpResponse.json({ sbi: '12345678' })
        ),
        http.get('/api/dal/linked-contacts/list/12345678', () =>
          HttpResponse.json([
            {
              crn: '111111111',
              firstName: 'John',
              lastName: 'Smith',
              role: 'Role 1'
            },
            {
              crn: '222222222',
              firstName: 'Jane',
              lastName: 'Doe',
              role: 'Role 2'
            }
          ])
        ),
        http.get('/api/dal/linked-contacts/details/12345678/111111111', () =>
          HttpResponse.json({
            displayName: 'first last',
            details: [
              { dt: 'CRN', dd: 'crn' },
              { dt: 'Full Name', dd: 'title first middle last' },
              { dt: 'Role', dd: 'Role' }
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
        http.get(
          '/api/dal/linked-contacts/authenticate-questions/111111111',
          () =>
            HttpResponse.json({
              items: [
                { dt: 'Date of Birth', dd: '01/01/2025' },
                { dt: 'Memorable Date', dd: '11/19/2024' },
                { dt: 'Memorable Location', dd: 'memorableLocation' },
                { dt: 'Memorable Event', dd: 'memorableEvent' },
                { dt: 'Updated at', dd: '31/12/2024' }
              ]
            })
        ),
        http.get('/api/dal/linked-contacts/details/12345678/222222222', () =>
          HttpResponse.json({})
        )
      )

      // Params that are set by CRM
      window.history.pushState(
        null,
        '',
        `?id=8b725f88-1562-4d4c-8c21-c185e46fa56c&typename=account`
      )

      const { getByRole, getByText, getByPlaceholder, getByLabelText } =
        await render(
          <AuthProvider config={{ disabled: true }}>
            <Page />
          </AuthProvider>
        )

      await expect
        .element(getByRole('heading', { name: 'Linked Contacts' }))
        .toBeInTheDocument()

      // // Table present with correct columns
      await expect.element(getByRole('table')).toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: 'CRN' }))
        .toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: 'First Name' }))
        .toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: 'Last Name' }))
        .toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: 'Role' }))
        .toBeInTheDocument()

      // Click a row
      await getByText('111111111').click()

      // Click to expand permission
      await getByRole('button', {
        name: 'Permission Description'
      }).click()
      await expect.element(getByText('Permission Function')).toBeInTheDocument()

      await getByText('View Authenticate Questions').click()
      await expect.element(await getByText('Memorable Date'))
      await expect.element(await getByText('Date of Birth'))
      await expect.element(await getByText('Memorable Location'))
      await expect.element(await getByText('Memorable Event'))
      await expect.element(await getByText('Updated at'))

      // Search for an item
      await userEvent.type(getByPlaceholder('Enter search term'), '222222222')

      // Click result
      await getByText('222222222').click()

      await getByRole('button', { name: 'Clear search' }).click()
    }
  )
})
