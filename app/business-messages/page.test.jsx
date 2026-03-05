import { AuthProvider } from '@/components/auth/auth-provider'
import { http, HttpResponse } from 'msw'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
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

      // Filter controls are present
      await expect.element(getByLabelText('Contact')).toBeInTheDocument()
      await expect.element(getByLabelText('Date Range')).toBeInTheDocument()
      await expect
        .element(getByLabelText('Show Read/Unread'))
        .toBeInTheDocument()

      // Select a contact to reveal the messages table
      await userEvent.selectOptions(getByLabelText('Contact'), '111111111')

      // Table appears with correct columns
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

      // Both messages are listed
      await expect
        .element(getByText('First Message Subject'))
        .toBeInTheDocument()
      await expect
        .element(getByText('Second Message Subject'))
        .toBeInTheDocument()

      // Click msg1 (read=true, deleted=false, has body) — view details
      await getByRole('cell', { name: 'First Message Subject' }).click()
      await expect
        .element(getByRole('heading', { name: 'First Message Subject' }))
        .toBeInTheDocument()
      await expect
        .element(getByText('First message body content'))
        .toBeInTheDocument()

      // Click msg2 (read=false, deleted=true, no body) — covers those branches
      await getByRole('cell', { name: 'Second Message Subject' }).click()
      await expect
        .element(getByRole('heading', { name: 'Second Message Subject' }))
        .toBeInTheDocument()
      await expect.element(getByText('No message content')).toBeInTheDocument()

      // Change date range to 'All' — triggers computeFromDate(NaN) → '' in both components
      await userEvent.selectOptions(getByLabelText('Date Range'), 'all')

      // Filter by Read — only msg1 (read=true) should remain in the table
      await userEvent.selectOptions(getByLabelText('Show Read/Unread'), 'read')
      await expect
        .element(getByRole('cell', { name: 'First Message Subject' }))
        .toBeInTheDocument()

      // Filter by Unread — only msg2 (read=false) should remain in the table
      await userEvent.selectOptions(
        getByLabelText('Show Read/Unread'),
        'unread'
      )
      await expect
        .element(getByRole('cell', { name: 'Second Message Subject' }))
        .toBeInTheDocument()
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

      // Pre-set a messageId that won't match any message
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

      // Page still renders correctly
      await expect
        .element(getByRole('heading', { name: 'Business Messages' }))
        .toBeInTheDocument()

      // Details panel returns null — no message heading visible
      await expect
        .element(getByRole('heading', { name: 'First Message Subject' }))
        .not.toBeInTheDocument()
      await expect
        .element(getByRole('heading', { name: 'Second Message Subject' }))
        .not.toBeInTheDocument()
    }
  )
})
