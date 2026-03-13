import { render } from 'vitest-browser-react'

import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary.jsx'

describe('ErrorBoundary component tests', () => {
  it('renders the error message when an error is thrown', async () => {
    const ThrowError = () => {
      throw new Error('Test error')
    }

    const { getByRole, getByText } = await render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )

    await expect.element(getByText('Something went wrong')).toBeInTheDocument()
    await expect
      .element(
        getByText(
          'The page hit an unexpected error. You can try refreshing to recover from this error.'
        )
      )
      .toBeInTheDocument()
    await expect.element(getByText('Error details')).toBeInTheDocument()

    const refreshButton = getByRole('button', { name: 'Refresh' })
    await expect.element(refreshButton).toBeInTheDocument()
    // await refreshButton.click() // NOTE: do not try this!! 💥
  })

  it('renders normal child elements when no error is thrown', async () => {
    const { getByRole, getByText } = await render(
      <ErrorBoundary>
        <div>Normal content</div>
      </ErrorBoundary>
    )
    await expect.element(getByText('Normal content')).toBeInTheDocument()
  })
})
