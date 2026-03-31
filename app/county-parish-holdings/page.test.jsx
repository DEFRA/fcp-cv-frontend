import { http, HttpResponse } from 'msw'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'

import { AuthProvider } from '@/components/auth/auth-provider'
import { testWithWorker } from '../../test/test-with-worker'
import Page from './page.jsx'

describe('CountyParishHoldingsPage tests', () => {
  beforeAll(() => {
    vi.mock('@/config', () => ({
      config: { get: (key) => 'error' } // quiet logs in test
    }))
  })

  testWithWorker(
    'renders the page component with content',
    async ({ worker }) => {
      worker.use(
        http.get(
          '/api/dataverse/account/8b725f88-1562-4d4c-8c21-c185e46fa56c',
          () => HttpResponse.json({ sbi: '12345678' })
        ),
        http.get('/api/dal/county-parish-holdings/12345678', () =>
          HttpResponse.json({
            details: {
              '11/222/3333': [
                {
                  dd: 'Someplace',
                  dt: 'Parish'
                },
                {
                  dd: 'Start Date',
                  dt: '01/01/2000'
                },
                {
                  dd: 'End Date',
                  dt: '31/12/2000'
                },
                {
                  dd: '111111, 222222',
                  dt: 'Coordinates (x, y)'
                },
                {
                  dd: 'SPECIES',
                  dt: 'Species'
                },
                {
                  dd: 'ADDRESS',
                  dt: 'Address'
                }
              ]
            },
            list: [
              {
                address: 'ADDRESS',
                cphNumber: '11/222/3333',
                endDate: '31/12/2000',
                parish: 'Someplace',
                species: 'SPECIES',
                startDate: '01/01/2000',
                xCoordinate: 111111,
                yCoordinate: 222222
              },
              {
                address: 'ADDRESS',
                cphNumber: '00/111/22222',
                endDate: '31/12/2000',
                parish: 'Some Town',
                species: 'SPECIES',
                startDate: '01/01/2000',
                xCoordinate: 111111,
                yCoordinate: 222222
              }
            ]
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
        .element(getByRole('heading', { name: 'County Parish Holdings' }))
        .toBeInTheDocument()

      // Table present with correct columns
      await expect.element(getByRole('table')).toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: 'CPH number' }))
        .toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: 'Parish' }))
        .toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: 'Start Date' }))
        .toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: 'End Date' }))
        .toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: 'Species' }))
        .not.toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: 'Address' }))
        .not.toBeInTheDocument()

      // Click a row
      await getByText('00/111/22222').click()

      // Search for an item
      await userEvent.type(getByPlaceholder('Enter search term'), '11/222/3333')

      // Click result
      await getByText('11/222/3333').click()

      await getByRole('button', { name: 'Clear search' }).click()
    }
  )
})
