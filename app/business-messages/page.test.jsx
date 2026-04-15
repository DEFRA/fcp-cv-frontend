import { AuthProvider } from '@/components/auth/auth-provider'
import { delay, http, HttpResponse } from 'msw'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { notification } from '@/components/notification/Notifications'
import { testWithWorker } from '../../test/test-with-worker'
import Page from './page.jsx'

const mockMessages = [
  {
    id: 'msg1',
    subject: 'First Message Subject',
    date: '2024-06-01T00:00:00Z',
    body: 'First message body content',
    read: true,
    deleted: false
  },
  {
    id: 'msg2',
    subject: 'Second Message Subject',
    date: '2024-07-15T00:00:00Z',
    body: null,
    read: false,
    deleted: true
  }
]

describe('Business Messages page tests', () => {
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
  })

  testWithWorker(
    'renders the page with content and supports full interaction',
    async ({ worker }) => {
      worker.use(
        http.get(
          '/api/dataverse/account/8b725f88-1562-4d4c-8c21-c185e46fa56c',
          () => HttpResponse.json({ sbi: '123456789' })
        ),
        http.get('/api/dal/business-messages/contacts/123456789', () =>
          HttpResponse.json([
            { crn: '111111111', firstName: 'John', lastName: 'Smith' },
            { crn: '222222222', firstName: 'Jane', lastName: 'Doe' }
          ])
        ),
        http.get(
          '/api/dal/business-messages/messages/123456789/111111111',
          () => HttpResponse.json(mockMessages)
        )
      )

      window.history.pushState(
        null,
        '',
        `?id=8b725f88-1562-4d4c-8c21-c185e46fa56c&typename=account`
      )

      const { getByRole, getByText, getByLabelText } = await render(
        <AuthProvider config={{ disabled: true }}>
          <Page />
        </AuthProvider>
      )

      await expect
        .element(getByRole('heading', { name: 'Business Messages' }))
        .toBeInTheDocument()

      await expect.element(getByLabelText('Contact')).toBeInTheDocument()
      await expect.element(getByLabelText('Date Range')).toBeInTheDocument()
      await expect
        .element(getByLabelText('Show Read/Unread'))
        .toBeInTheDocument()

      await userEvent.selectOptions(getByLabelText('Contact'), '111111111')

      await expect.element(getByRole('table')).toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: 'Status', exact: true }))
        .toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: 'Date', exact: true }))
        .toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: 'Subject', exact: true }))
        .toBeInTheDocument()

      await expect
        .element(getByText('First Message Subject'))
        .toBeInTheDocument()
      await expect
        .element(getByText('Second Message Subject'))
        .toBeInTheDocument()

      await getByRole('cell', { name: 'First Message Subject' }).click()
      await expect
        .element(getByRole('heading', { name: 'First Message Subject' }))
        .toBeInTheDocument()
      await expect
        .element(getByText('First message body content'))
        .toBeInTheDocument()

      await getByRole('cell', { name: 'Second Message Subject' }).click()
      await expect
        .element(getByRole('heading', { name: 'Second Message Subject' }))
        .toBeInTheDocument()
      await expect.element(getByText('No message content')).toBeInTheDocument()

      await userEvent.selectOptions(getByLabelText('Date Range'), 'all')

      await userEvent.selectOptions(getByLabelText('Show Read/Unread'), 'read')
      await expect
        .element(getByRole('cell', { name: 'First Message Subject' }))
        .toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: 'Second Message Subject' }))
        .not.toBeInTheDocument()

      await userEvent.selectOptions(
        getByLabelText('Show Read/Unread'),
        'unread'
      )
      await expect
        .element(getByRole('cell', { name: 'Second Message Subject' }))
        .toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: 'First Message Subject' }))
        .not.toBeInTheDocument()
    }
  )

  testWithWorker(
    'contact dropdown shows "Loading..." while contacts are being fetched',
    async ({ worker }) => {
      worker.use(
        http.get(
          '/api/dataverse/account/aaaaaaaa-0000-0000-0000-000000000001',
          () => HttpResponse.json({ sbi: '111000001' })
        ),
        http.get('/api/dal/business-messages/contacts/111000001', async () => {
          await delay('infinite')
        })
      )

      window.history.pushState(
        null,
        '',
        `?id=aaaaaaaa-0000-0000-0000-000000000001&typename=account`
      )

      const { getByLabelText } = await render(
        <AuthProvider config={{ disabled: true }}>
          <Page />
        </AuthProvider>
      )

      const contactSelect = getByLabelText('Contact')
      await expect
        .element(contactSelect.getByRole('option', { name: 'Loading...' }))
        .toBeInTheDocument()
    }
  )

  testWithWorker(
    'table shows 5 skeleton rows while messages are loading',
    async ({ worker }) => {
      worker.use(
        http.get(
          '/api/dataverse/account/aaaaaaaa-0000-0000-0000-000000000003',
          () => HttpResponse.json({ sbi: '111000003' })
        ),
        http.get('/api/dal/business-messages/contacts/111000003', () =>
          HttpResponse.json([
            { crn: '999999999', firstName: 'Test', lastName: 'User' }
          ])
        ),
        http.get(
          '/api/dal/business-messages/messages/111000003/999999999*',
          async () => {
            await delay('infinite')
          }
        )
      )

      window.history.pushState(
        null,
        '',
        `?id=aaaaaaaa-0000-0000-0000-000000000003&typename=account&sbi=111000003&contact=999999999`
      )

      const { getByRole } = await render(
        <AuthProvider config={{ disabled: true }}>
          <Page />
        </AuthProvider>
      )

      await expect.element(getByRole('table')).toBeInTheDocument()

      const rows = getByRole('row')
      expect(rows).toHaveLength(6) // 1 header row & 5 skeleton rows
    }
  )

  testWithWorker(
    'contact dropdown options are sorted alphabetically by first and last name',
    async ({ worker }) => {
      worker.use(
        http.get(
          '/api/dataverse/account/aaaaaaaa-0000-0000-0000-000000000002',
          () => HttpResponse.json({ sbi: '111000002' })
        ),
        http.get('/api/dal/business-messages/contacts/111000002', () =>
          HttpResponse.json([
            { crn: '333333333', firstName: 'Charlie', lastName: 'Brown' },
            { crn: '111111111', firstName: 'Alice', lastName: 'Smith' },
            { crn: '222222222', firstName: 'Bob', lastName: 'Jones' }
          ])
        )
      )

      window.history.pushState(
        null,
        '',
        `?id=aaaaaaaa-0000-0000-0000-000000000002&typename=account`
      )

      const { getByLabelText } = await render(
        <AuthProvider config={{ disabled: true }}>
          <Page />
        </AuthProvider>
      )

      const contactSelect = getByLabelText('Contact')

      await expect
        .element(contactSelect.getByRole('option', { name: 'Alice Smith' }))
        .toBeInTheDocument()

      const options = contactSelect.element().querySelectorAll('option')
      const names = [...options]
        .filter((o) => o.value !== '')
        .map((o) => o.textContent.trim())

      expect(names).toEqual(['Alice Smith', 'Bob Jones', 'Charlie Brown'])
    }
  )

  testWithWorker(
    'shows error notification when no contacts are found for the SBI',
    async ({ worker }) => {
      worker.use(
        http.get('/api/dal/business-messages/contacts/20000001', () =>
          HttpResponse.json([])
        )
      )

      window.history.pushState(null, '', '?sbi=20000001')

      await render(
        <AuthProvider config={{ disabled: true }}>
          <Page />
        </AuthProvider>
      )

      await vi.waitFor(() => {
        expect(notification.error).toHaveBeenCalledWith(
          'No contacts found for business with SBI 20000001.'
        )
      })
    }
  )

  testWithWorker(
    'shows error notification when the message ID is not found in the loaded messages',
    async ({ worker }) => {
      worker.use(
        http.get('/api/dal/business-messages/contacts/20000002', () =>
          HttpResponse.json([
            { crn: '333333333', firstName: 'Test', lastName: 'User' }
          ])
        ),
        http.get(
          '/api/dal/business-messages/messages/20000002/333333333*',
          () => HttpResponse.json(mockMessages)
        )
      )

      window.history.pushState(
        null,
        '',
        '?sbi=20000002&contact=333333333&messageId=nonexistent-msg&dateRange=all'
      )

      await render(
        <AuthProvider config={{ disabled: true }}>
          <Page />
        </AuthProvider>
      )

      await vi.waitFor(() => {
        expect(notification.error).toHaveBeenCalledWith(
          'No message found for business with SBI 20000002, Contact ID 333333333 and Message ID nonexistent-msg.'
        )
      })
    }
  )

  testWithWorker(
    'details panel is hidden when messageId does not match any loaded message',
    async ({ worker }) => {
      worker.use(
        http.get(
          '/api/dataverse/account/8b725f88-1562-4d4c-8c21-c185e46fa56c',
          () => HttpResponse.json({ sbi: '123456789' })
        ),
        http.get('/api/dal/business-messages/contacts/123456789', () =>
          HttpResponse.json([
            { crn: '111111111', firstName: 'John', lastName: 'Smith' }
          ])
        ),
        http.get(
          '/api/dal/business-messages/messages/123456789/111111111',
          () => HttpResponse.json(mockMessages)
        )
      )

      window.history.pushState(
        null,
        '',
        `?id=8b725f88-1562-4d4c-8c21-c185e46fa56c&typename=account&contact=111111111&messageId=nonexistent`
      )

      const { getByRole } = await render(
        <AuthProvider config={{ disabled: true }}>
          <Page />
        </AuthProvider>
      )

      await expect
        .element(getByRole('heading', { name: 'Business Messages' }))
        .toBeInTheDocument()

      await expect
        .element(getByRole('heading', { name: 'First Message Subject' }))
        .not.toBeInTheDocument()
      await expect
        .element(getByRole('heading', { name: 'Second Message Subject' }))
        .not.toBeInTheDocument()
    }
  )
})
