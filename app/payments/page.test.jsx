import { AuthProvider } from '@/components/auth/auth-provider'
import { http, HttpResponse } from 'msw'
import { SWRConfig } from 'swr'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { notification } from '@/components/notification/Notifications'
import { testWithWorker } from '../../test/test-with-worker'
import Page from './page.jsx'
import { PaymentsDetails } from './payments-details'
import { PaymentsList } from './payments-list'

const mockPayments = {
  payments: [
    {
      reference: 'PAY0000001',
      date: '2023-03-15',
      amount: 2500,
      line_items: [
        {
          agreement_reference: 'AG00001234',
          claim_number: 'CLM0001',
          scheme: 'Countryside Stewardship',
          marketing_year: '2023',
          description: 'Arable field margins',
          amount: 1500
        }
      ]
    },
    {
      reference: 'PAY0000002',
      date: '2022-06-01',
      amount: 750.5,
      line_items: [
        {
          agreement_reference: 'AG00009999',
          claim_number: 'CLM0003',
          scheme: 'Basic Payment Scheme',
          marketing_year: '2022',
          description: 'BPS payment',
          amount: 750.5
        }
      ]
    }
  ],
  onHold: true
}

const defaultUrl = '?id=8b725f88-1562-4d4c-8c21-c185e46fa56c&typename=account'

const defaultWorkerHandlers = (worker) =>
  worker.use(
    http.get(
      '/api/dataverse/account/8b725f88-1562-4d4c-8c21-c185e46fa56c',
      () => HttpResponse.json({ sbi: '123456789' })
    ),
    http.get('/api/dal/payments/123456789', () =>
      HttpResponse.json(mockPayments)
    )
  )

const renderPage = () =>
  render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <AuthProvider config={{ disabled: true }}>
        <Page />
      </AuthProvider>
    </SWRConfig>
  )

describe('PaymentsPage tests', () => {
  beforeAll(() => {
    vi.mock('@/config', () => ({
      config: { get: () => 'error' } // quiet logs in test
    }))
    vi.mock('@/components/notification/Notifications', () => ({
      notification: {
        error: vi.fn(),
        warn: vi.fn()
      }
    }))
  })

  beforeEach(() => {
    vi.clearAllMocks()
    window.history.pushState(null, '', '/')
  })

  testWithWorker(
    'renders the payments list with correct columns, both payments, and formatted amounts',
    async ({ worker }) => {
      defaultWorkerHandlers(worker)
      window.history.pushState(null, '', defaultUrl)

      const { getByRole } = await renderPage()

      await expect
        .element(getByRole('heading', { name: 'Payments', exact: true }))
        .toBeInTheDocument()

      await expect
        .element(getByRole('cell', { name: 'Reference' }))
        .toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: 'Date', exact: true }))
        .toBeInTheDocument()

      await expect
        .element(getByRole('cell', { name: 'PAY0000001' }))
        .toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: 'PAY0000002' }))
        .toBeInTheDocument()

      await expect
        .element(getByRole('cell', { name: '2,500.00 GBP' }))
        .toBeInTheDocument()
    }
  )

  testWithWorker(
    'shows On Hold: Yes when onHold is true',
    async ({ worker }) => {
      defaultWorkerHandlers(worker)
      window.history.pushState(null, '', defaultUrl)

      const { getByText } = await renderPage()

      await expect.element(getByText(/On Hold: Yes/)).toBeInTheDocument()
    }
  )

  testWithWorker(
    'shows On Hold: No when onHold is false',
    async ({ worker }) => {
      worker.use(
        http.get(
          '/api/dataverse/account/8b725f88-1562-4d4c-8c21-c185e46fa56c',
          () => HttpResponse.json({ sbi: '123456789' })
        ),
        http.get('/api/dal/payments/123456789', () =>
          HttpResponse.json({ ...mockPayments, onHold: false })
        )
      )
      window.history.pushState(null, '', defaultUrl)

      const { getByText } = await renderPage()

      await expect.element(getByText(/On Hold: No/)).toBeInTheDocument()
    }
  )

  testWithWorker(
    'clicking a payment row shows its details in the right panel',
    async ({ worker }) => {
      defaultWorkerHandlers(worker)
      window.history.pushState(null, '', defaultUrl)

      const { getByRole } = await renderPage()

      await expect
        .element(getByRole('heading', { name: 'PAY0000002' }))
        .toBeInTheDocument()

      await getByRole('cell', { name: 'PAY0000001' }).click()

      await expect
        .element(getByRole('heading', { name: 'PAY0000001' }))
        .toBeInTheDocument()
      await expect
        .element(getByRole('heading', { name: 'PAY0000002' }))
        .not.toBeInTheDocument()
    }
  )

  testWithWorker(
    'searching by reference filters the payments list',
    async ({ worker }) => {
      defaultWorkerHandlers(worker)
      window.history.pushState(null, '', defaultUrl)

      const { getByRole, getByLabelText } = await renderPage()

      await expect
        .element(getByRole('cell', { name: 'PAY0000001' }))
        .toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: 'PAY0000002' }))
        .toBeInTheDocument()

      await userEvent.type(getByLabelText('Search'), 'PAY0000001')

      await expect
        .element(getByRole('cell', { name: 'PAY0000001' }))
        .toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: 'PAY0000002' }))
        .not.toBeInTheDocument()
    }
  )

  testWithWorker(
    'clearing search resets the payments list',
    async ({ worker }) => {
      defaultWorkerHandlers(worker)
      window.history.pushState(null, '', defaultUrl)

      const { getByRole, getByLabelText } = await renderPage()

      await userEvent.type(getByLabelText('Search'), 'PAY0000001')

      await expect
        .element(getByRole('cell', { name: 'PAY0000002' }))
        .not.toBeInTheDocument()

      await getByRole('button', { name: 'Clear search' }).click()

      await expect
        .element(getByRole('cell', { name: 'PAY0000001' }))
        .toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: 'PAY0000002' }))
        .toBeInTheDocument()
    }
  )

  testWithWorker(
    'shows No payments found when payments array is empty',
    async ({ worker }) => {
      worker.use(
        http.get(
          '/api/dataverse/account/8b725f88-1562-4d4c-8c21-c185e46fa56c',
          () => HttpResponse.json({ sbi: '123456789' })
        ),
        http.get('/api/dal/payments/123456789', () =>
          HttpResponse.json({ payments: [], onHold: false })
        )
      )
      window.history.pushState(null, '', defaultUrl)

      const { getByRole } = await renderPage()

      await expect
        .element(getByRole('cell', { name: 'No payments found' }))
        .toBeInTheDocument()
    }
  )

  testWithWorker(
    'shows line items table with correct columns and data for auto-selected payment',
    async ({ worker }) => {
      defaultWorkerHandlers(worker)
      window.history.pushState(null, '', defaultUrl)

      const { getByRole, getByText } = await renderPage()

      await expect
        .element(getByRole('heading', { name: 'PAY0000002' }))
        .toBeInTheDocument()

      await expect.element(getByText('Line Items')).toBeInTheDocument()

      await expect.element(getByText('AG00009999')).toBeInTheDocument()
      await expect.element(getByText('CLM0003')).toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: 'Basic Payment Scheme' }))
        .toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: 'BPS payment' }))
        .toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: '2022', exact: true }))
        .toBeInTheDocument()
    }
  )

  testWithWorker(
    'shows error notification when no payments are found for the SBI',
    async ({ worker }) => {
      worker.use(
        http.get('/api/dal/payments/40000001', () =>
          HttpResponse.json(null, { status: 404 })
        )
      )

      window.history.pushState(null, '', '?sbi=40000001')

      await render(
        <SWRConfig value={{ provider: () => new Map() }}>
          <AuthProvider config={{ disabled: true }}>
            <Page />
          </AuthProvider>
        </SWRConfig>
      )

      await vi.waitFor(() => {
        expect(notification.error).toHaveBeenCalledWith(
          'Business with SBI 40000001 not found.'
        )
      })
    }
  )

  testWithWorker(
    'shows line items and formatted amounts for a clicked payment',
    async ({ worker }) => {
      defaultWorkerHandlers(worker)
      window.history.pushState(null, '', defaultUrl)

      const { getByRole, getByText } = await renderPage()

      await getByRole('cell', { name: 'PAY0000001' }).click()

      await expect
        .element(getByRole('heading', { name: 'PAY0000001' }))
        .toBeInTheDocument()

      await expect.element(getByText('AG00001234')).toBeInTheDocument()
      await expect.element(getByText('CLM0001')).toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: 'Countryside Stewardship' }))
        .toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: 'Arable field margins' }))
        .toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: '1,500.00 GBP' }))
        .toBeInTheDocument()
    }
  )
})

describe('PaymentsList component tests', () => {
  beforeEach(() => {
    window.history.pushState(null, '', '/')
  })

  const renderList = () =>
    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <AuthProvider config={{ disabled: true }}>
          <PaymentsList />
        </AuthProvider>
      </SWRConfig>
    )

  testWithWorker(
    'renders with sbi in URL and shows payment data with formatted amounts',
    async ({ worker }) => {
      worker.use(
        http.get('/api/dal/payments/123456789', () =>
          HttpResponse.json(mockPayments)
        )
      )
      window.history.pushState(null, '', '?sbi=123456789')

      const { getByRole } = await renderList()

      await expect
        .element(getByRole('cell', { name: 'PAY0000001' }))
        .toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: '750.50 GBP' }))
        .toBeInTheDocument()
    }
  )
})

describe('PaymentsDetails component tests', () => {
  beforeEach(() => {
    window.history.pushState(null, '', '/')
  })

  const renderDetails = () =>
    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <AuthProvider config={{ disabled: true }}>
          <PaymentsDetails />
        </AuthProvider>
      </SWRConfig>
    )

  testWithWorker(
    'shows payment details when sbi and paymentRef are set',
    async ({ worker }) => {
      worker.use(
        http.get('/api/dal/payments/123456789', () =>
          HttpResponse.json(mockPayments)
        )
      )
      window.history.pushState(null, '', '?sbi=123456789&paymentRef=PAY0000001')

      const { getByRole } = await renderDetails()

      await expect
        .element(getByRole('heading', { name: 'PAY0000001' }))
        .toBeInTheDocument()
    }
  )

  testWithWorker(
    'renders without crashing when paymentRef does not match any payment',
    async ({ worker }) => {
      worker.use(
        http.get('/api/dal/payments/123456789', () =>
          HttpResponse.json(mockPayments)
        )
      )
      window.history.pushState(
        null,
        '',
        '?sbi=123456789&paymentRef=NONEXISTENT'
      )

      const { getByRole } = await renderDetails()

      await expect
        .element(getByRole('heading', { name: 'Line Items' }))
        .toBeInTheDocument()
    }
  )

  testWithWorker(
    'shows No payments found when payments array is empty',
    async ({ worker }) => {
      worker.use(
        http.get('/api/dal/payments/123456789', () =>
          HttpResponse.json({ payments: [], onHold: false })
        )
      )
      window.history.pushState(null, '', '?sbi=123456789')

      const { getByText } = await renderDetails()

      await expect.element(getByText('No payments found')).toBeInTheDocument()
    }
  )
})
