import { http, HttpResponse } from 'msw'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'

import { AuthProvider } from '@/components/auth/auth-provider'
import { testWithWorker } from '../../test/test-with-worker'
import Page from './page.jsx'

describe('ApplicationsPage tests', () => {
  testWithWorker(
    'renders the page component with content',
    async ({ worker }) => {
      worker.use(
        http.get(
          '/api/dataverse/account/8b725f88-1562-4d4c-8c21-c185e46fa56c',
          () => HttpResponse.json({ sbi: '12345678' })
        ),
        http.get('/api/dal/applications/12345678', () =>
          HttpResponse.json({
            list: [
              {
                id: '5836775937',
                year: 2022,
                name: 'VOX CURRUS DELEO PEIOR CUNABULA AGNITIO CUR DEMO',
                status: 'PAID'
              },
              {
                id: '5836775938',
                year: 2022,
                name: 'VOX CURRUS DELEO PEIOR CUNABULA AGNITIO CUR DEMO',
                status: 'PAID'
              }
            ],
            details: {
              5836775937: {
                name: 'VOX CURRUS DELEO PEIOR CUNABULA AGNITIO CUR DEMO',
                summary: [
                  { dt: 'Application ID', dd: '5836775937' },
                  {
                    dt: 'Scheme',
                    dd: 'CIVITAS THECA PAUCI ACER SUNT VALETUDO'
                  },
                  { dt: 'Year', dd: 2022 },
                  { dt: 'Status', dd: 'PAID' },
                  { dt: 'Status (Portal)', dd: null },
                  { dt: 'Submitted Date', dd: '31/12/2022' },
                  { dt: 'Agreement References', dd: ['3242226112'] },
                  { dt: 'Last Movement', dd: 'TO PAID' },
                  { dt: 'Last Movement Date/Time', dd: '31/12/2022' }
                ],
                movementHistory: [
                  {
                    id: '6338450300',
                    name: 'TO PAID',
                    timestamp: '2022-12-31T06:30:16.953Z',
                    checkStatus: 'PASSED'
                  }
                ]
              }
            }
          })
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
        .element(getByRole('heading', { name: 'Applications', exact: true }))
        .toBeInTheDocument()

      // Table present with correct columns
      await expect.element(getByRole('table')).toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: 'Application ID' }))
        .toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: 'Year' }))
        .toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: 'Application Name' }))
        .toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: 'Status' }))
        .toBeInTheDocument()

      // // Click a row
      await getByText('5836775937').click()

      // // Search for an item
      await userEvent.type(getByPlaceholder('Enter search term'), '5836775938')

      // // Click result
      await getByText('5836775938').click()

      await getByRole('button', { name: 'Clear search' }).click()
    }
  )
})
