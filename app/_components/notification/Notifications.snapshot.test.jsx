import { renderToString } from 'react-dom/server'
import { vi } from 'vitest'

vi.mock('react-toastify', () => {
  const ToastContainer = (props) => {
    const typesToSample = ['error', 'warning', 'info', 'default', undefined]
    const toastClassNames = typesToSample.map((type) =>
      props.toastClassName?.({ type })
    )

    return (
      <div
        data-testid="toast-container"
        data-position={props.position}
        data-autoclose={String(props.autoClose)}
        data-classname={props.className}
        data-closebutton={props.closeButton?.name ?? typeof props.closeButton}
        data-toastclassnames={JSON.stringify(toastClassNames)}
      />
    )
  }

  return {
    ToastContainer,
    toast: vi.fn()
  }
})

describe('Notifications snapshot', () => {
  it('matches the rendered structure', async () => {
    const { default: Notifications } = await import('./Notifications')
    const html = renderToString(<Notifications />)

    expect(html).toMatchSnapshot()
  })
})
