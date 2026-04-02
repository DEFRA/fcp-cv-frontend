import { http, HttpResponse } from 'msw'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'

import { AuthProvider } from '@/components/auth/auth-provider'
import { testWithWorker } from '../../test/test-with-worker'
import Page from './page.jsx'

const mockAgreements = {
  list: [
    {
      contractId: 'AG00001234',
      schemeYear: 2023,
      name: 'Countryside Stewardship Higher Tier',
      contractType: 'Higher Tier',
      startDate: '01/01/2023',
      endDate: '31/12/2027',
      status: 'Active'
    },
    {
      contractId: 'AG00005678',
      schemeYear: 2022,
      name: 'Sustainable Farming Incentive',
      contractType: 'Mid Tier',
      startDate: '01/01/2022',
      endDate: '31/12/2026',
      status: 'Expired'
    }
  ],
  details: {
    AG00001234: {
      name: 'Countryside Stewardship Higher Tier',
      summary: [
        { dt: 'Agreement Reference', dd: 'AG00001234' },
        { dt: 'Status', dd: 'Active' },
        { dt: 'Type', dd: 'Higher Tier' },
        { dt: 'Start Date', dd: '01/01/2023' },
        { dt: 'Scheme Year', dd: 2023 },
        { dt: 'End Date', dd: '31/12/2027' }
      ],
      paymentSchedules: [
        {
          sheetName: 'SY1234',
          parcelName: '0001',
          optionDescription: 'Arable field margins',
          actionArea: 0.8,
          actionMTL: 120,
          actionUnits: 1,
          parcelTotalArea: 2.1,
          paymentSchedule: '01/01/2023 - 31/12/2023',
          commitmentTerm: '01/01/2023 - 31/12/2027'
        }
      ]
    },
    AG00005678: {
      name: 'Sustainable Farming Incentive',
      summary: [
        { dt: 'Agreement Reference', dd: 'AG00005678' },
        { dt: 'Status', dd: 'Expired' },
        { dt: 'Type', dd: 'Mid Tier' },
        { dt: 'Start Date', dd: '01/01/2022' },
        { dt: 'Scheme Year', dd: 2022 },
        { dt: 'End Date', dd: '31/12/2026' }
      ],
      paymentSchedules: []
    }
  }
}

const defaultWorkerHandlers = (worker) =>
  worker.use(
    http.get(
      '/api/dataverse/account/8b725f88-1562-4d4c-8c21-c185e46fa56c',
      () => HttpResponse.json({ sbi: '12345678' })
    ),
    http.get('/api/dal/agreements/12345678', () =>
      HttpResponse.json(mockAgreements)
    )
  )

const defaultUrl = '?id=8b725f88-1562-4d4c-8c21-c185e46fa56c&typename=account'

describe('AgreementsPage tests', () => {
  testWithWorker(
    'renders the agreements list with correct columns',
    async ({ worker }) => {
      defaultWorkerHandlers(worker)
      window.history.pushState(null, '', defaultUrl)

      const { getByRole } = await render(
        <AuthProvider config={{ disabled: true }}>
          <Page />
        </AuthProvider>
      )

      await expect
        .element(getByRole('heading', { name: 'Agreements', exact: true }))
        .toBeInTheDocument()

      await expect.element(getByRole('table')).toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: 'Reference' }))
        .toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: 'Year' }))
        .toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: 'Agreement Name' }))
        .toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: 'Type' }))
        .toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: 'Start Date' }))
        .toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: 'End Date' }))
        .toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: 'Status' }))
        .toBeInTheDocument()

      await expect
        .element(getByRole('cell', { name: 'View' }).first())
        .toBeInTheDocument()
    }
  )

  testWithWorker(
    'agreements list is sorted by year descending by default',
    async ({ worker }) => {
      defaultWorkerHandlers(worker)
      window.history.pushState(null, '', defaultUrl)

      const { getByRole } = await render(
        <AuthProvider config={{ disabled: true }}>
          <Page />
        </AuthProvider>
      )

      await expect.element(getByRole('table')).toBeInTheDocument()

      const rows = document.querySelectorAll('tbody tr')
      const firstRowYear = rows[0].querySelector('td:nth-child(2)')?.textContent
      const secondRowYear =
        rows[1].querySelector('td:nth-child(2)')?.textContent

      expect(Number(firstRowYear)).toBeGreaterThan(Number(secondRowYear))
    }
  )

  testWithWorker(
    'clicking an agreement row shows the agreement details with summary and payment schedules',
    async ({ worker }) => {
      defaultWorkerHandlers(worker)
      window.history.pushState(null, '', defaultUrl)

      const { getByRole, getByText } = await render(
        <AuthProvider config={{ disabled: true }}>
          <Page />
        </AuthProvider>
      )

      await getByText('AG00001234').click()

      await expect
        .element(
          getByRole('heading', { name: 'Countryside Stewardship Higher Tier' })
        )
        .toBeInTheDocument()

      await expect.element(getByText('Agreement Reference')).toBeInTheDocument()
      await expect.element(getByText('Status')).toBeInTheDocument()
      await expect.element(getByText('Type')).toBeInTheDocument()
      await expect.element(getByText('Start Date')).toBeInTheDocument()
      await expect.element(getByText('Scheme Year')).toBeInTheDocument()
      await expect.element(getByText('End Date')).toBeInTheDocument()

      await expect
        .element(getByRole('cell', { name: 'Sheet' }))
        .toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: 'Parcel', exact: true }))
        .toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: 'Description' }))
        .toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: 'Action Area (ha)' }))
        .toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: 'Action Length (m)' }))
        .toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: 'Action Units' }))
        .toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: 'Parcel Area (ha)' }))
        .toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: 'Payment Schedule' }))
        .toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: 'Commitment Term' }))
        .toBeInTheDocument()
    }
  )

  testWithWorker(
    'back button on agreement details returns to the agreements list',
    async ({ worker }) => {
      defaultWorkerHandlers(worker)
      window.history.pushState(null, '', defaultUrl)

      const { getByText, getByRole } = await render(
        <AuthProvider config={{ disabled: true }}>
          <Page />
        </AuthProvider>
      )

      await getByText('AG00001234').click()

      await expect
        .element(
          getByRole('heading', { name: 'Countryside Stewardship Higher Tier' })
        )
        .toBeInTheDocument()

      await getByRole('button', { name: '< Back to Agreements list' }).click()

      await expect.element(getByRole('table')).toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: 'Reference' }))
        .toBeInTheDocument()
    }
  )

  testWithWorker(
    'searching filters the agreements list and clicking clear resets it',
    async ({ worker }) => {
      defaultWorkerHandlers(worker)
      window.history.pushState(null, '', defaultUrl)

      const { getByText, getByPlaceholder, getByRole } = await render(
        <AuthProvider config={{ disabled: true }}>
          <Page />
        </AuthProvider>
      )

      await userEvent.type(getByPlaceholder('Enter search term'), 'AG00001234')

      await expect.element(getByText('AG00001234')).toBeInTheDocument()
      await expect.element(getByText('AG00005678')).not.toBeInTheDocument()

      await getByRole('button', { name: 'Clear search' }).click()

      await expect.element(getByText('AG00001234')).toBeInTheDocument()
      await expect.element(getByText('AG00005678')).toBeInTheDocument()
    }
  )

  testWithWorker(
    'sorts unknown summary dt keys to the end and renders columns when paymentSchedules is null',
    async ({ worker }) => {
      worker.use(
        http.get(
          '/api/dataverse/account/a1b2c3d4-0000-0000-0000-000000000001',
          () => HttpResponse.json({ sbi: '99999999' })
        ),
        http.get('/api/dal/agreements/99999999', () =>
          HttpResponse.json({
            list: [
              {
                contractId: 'AG00001234',
                schemeYear: 2023,
                name: 'Countryside Stewardship Higher Tier',
                contractType: 'Higher Tier',
                startDate: '01/01/2023',
                endDate: '31/12/2027',
                status: 'Active'
              }
            ],
            details: {
              AG00001234: {
                name: 'Countryside Stewardship Higher Tier',
                summary: [
                  { dt: 'Custom Extra Field', dd: 'extra value' },
                  { dt: 'Status', dd: 'Active' },
                  { dt: 'Agreement Reference', dd: 'AG00001234' }
                ],
                paymentSchedules: null
              }
            }
          })
        )
      )

      window.history.pushState(
        null,
        '',
        '?id=a1b2c3d4-0000-0000-0000-000000000001&typename=account'
      )

      const { getByRole, getByText } = await render(
        <AuthProvider config={{ disabled: true }}>
          <Page />
        </AuthProvider>
      )

      await getByText('AG00001234').click()

      await expect
        .element(
          getByRole('heading', { name: 'Countryside Stewardship Higher Tier' })
        )
        .toBeInTheDocument()

      await expect.element(getByText('Custom Extra Field')).toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: 'Sheet' }))
        .toBeInTheDocument()
    }
  )

  testWithWorker(
    'shows default summary labels when agreement summary is null',
    async ({ worker }) => {
      worker.use(
        http.get('/api/dal/agreements/12345678', () =>
          HttpResponse.json({
            list: [
              {
                contractId: 'AG00001234',
                schemeYear: 2023,
                name: 'Countryside Stewardship Higher Tier',
                contractType: 'Higher Tier',
                startDate: '01/01/2023',
                endDate: '31/12/2027',
                status: 'Active'
              }
            ],
            details: {
              AG00001234: {
                name: 'Countryside Stewardship Higher Tier',
                summary: null,
                paymentSchedules: []
              }
            }
          })
        )
      )

      window.history.pushState(null, '', '?sbi=12345678&contractId=AG00001234')

      const { getByText } = await render(
        <AuthProvider config={{ disabled: true }}>
          <Page />
        </AuthProvider>
      )

      await expect.element(getByText('Agreement Reference')).toBeInTheDocument()
    }
  )
})
