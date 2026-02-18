import { render } from 'vitest-browser-react'

import Notifications, {
  notification
} from '@/components/notification/Notifications'

describe('Notifications component tests', () => {
  it('renders each type of Notifications component', async () => {
    const { getByText } = await render(<Notifications />)

    notification('Test default notification')
    notification.error('Test error notification')
    notification.warning('Test warning notification')
    notification.info('Test info notification')

    await expect
      .element(getByText('Test default notification'))
      .toBeInTheDocument()
    await expect
      .element(getByText('Test error notification'))
      .toBeInTheDocument()
    await expect
      .element(getByText('Test warning notification'))
      .toBeInTheDocument()
    await expect
      .element(getByText('Test info notification'))
      .toBeInTheDocument()
  })

  it('closes the notification when the close button is clicked', async () => {
    const { getByText } = await render(<Notifications />)

    notification('Test unclosed notification')
    notification('Test close button')
    notification.error('Test unclosed error notification')

    await expect
      .element(getByText('Test unclosed notification'))
      .toBeInTheDocument()
    await expect
      .element(getByText('Test unclosed error notification'))
      .toBeInTheDocument()
    const notificationElement = await getByText('Test close button')
    await expect.element(notificationElement).toBeInTheDocument()

    // get the close button for target notification, and click it
    const closeButton = notificationElement.getByRole('button')
    await expect.element(closeButton).toBeInTheDocument()
    await closeButton.click()

    // check target notification closed, and others notifications remain
    await expect.element(getByText('Test close button')).not.toBeInTheDocument()
    await expect
      .element(getByText('Test unclosed notification'))
      .toBeInTheDocument()
    await expect
      .element(getByText('Test unclosed error notification'))
      .toBeInTheDocument()
  })
})
