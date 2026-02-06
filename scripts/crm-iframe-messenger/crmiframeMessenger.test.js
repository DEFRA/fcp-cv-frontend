import {
  DEFAULT_INIT_MESSAGE,
  IFRAME_CONTROL_NAME,
  IFRAME_ORIGIN,
  setupCrmMessenger
} from '../../tests/utils/crmExecutionEnvironment.js'

describe('crmiframeMessenger', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('registers a single message listener and starts INIT retry loop on load', async () => {
    const { parent, iframeWindow, executionContext, formContext } =
      await setupCrmMessenger({
        config: { initRetryIntervalMs: 10, initMaxAttempts: 2 },
        onLoadTimes: 2
      })

    expect(executionContext.getFormContext).toHaveBeenCalledTimes(2)
    expect(formContext.getControl).toHaveBeenCalledWith(IFRAME_CONTROL_NAME)

    expect(parent.addEventListener).toHaveBeenCalledTimes(1)
    expect(parent.addEventListener).toHaveBeenCalledWith(
      'message',
      expect.any(Function)
    )

    vi.advanceTimersByTime(25)
    expect(iframeWindow.postMessage).toHaveBeenCalledTimes(2)
  })

  it('sends INIT with entityName and recordId to configured origin', async () => {
    const { iframeWindow } = await setupCrmMessenger()

    vi.advanceTimersByTime(500)

    expect(iframeWindow.postMessage).toHaveBeenCalledWith(
      DEFAULT_INIT_MESSAGE,
      IFRAME_ORIGIN
    )
  })

  it('ignores messages from an unexpected origin', async () => {
    const { sendMessage, iframeWindow } = await setupCrmMessenger()
    sendMessage({ origin: 'http://evil.example', type: 'READY' })

    expect(iframeWindow.postMessage).not.toHaveBeenCalled()
  })

  it('ignores messages from an unexpected source when iframeWindow is known', async () => {
    const { sendMessage, iframeWindow } = await setupCrmMessenger()
    sendMessage({
      source: { postMessage: vi.fn() },
      type: 'READY'
    })

    expect(iframeWindow.postMessage).not.toHaveBeenCalled()
  })

  it('ignores invalid message formats (missing type)', async () => {
    const { sendMessage, iframeWindow } = await setupCrmMessenger()
    sendMessage({ data: { payload: { hello: 'world' } } })

    expect(iframeWindow.postMessage).not.toHaveBeenCalled()
  })

  it('handles READY by sending INIT immediately', async () => {
    const { sendMessage, iframeWindow } = await setupCrmMessenger()
    sendMessage({ type: 'READY' })

    expect(iframeWindow.postMessage).toHaveBeenCalledWith(
      DEFAULT_INIT_MESSAGE,
      IFRAME_ORIGIN
    )
  })

  it('handles INIT_ACK by stopping retries', async () => {
    const clearSpy = vi.spyOn(globalThis, 'clearInterval')

    const { sendMessage, iframeWindow } = await setupCrmMessenger({
      config: { initRetryIntervalMs: 10, initMaxAttempts: 20 }
    })

    vi.advanceTimersByTime(10)
    expect(iframeWindow.postMessage).toHaveBeenCalledTimes(1)

    sendMessage({ type: 'INIT_ACK' })

    expect(clearSpy).toHaveBeenCalled()

    vi.advanceTimersByTime(100)
    expect(iframeWindow.postMessage).toHaveBeenCalledTimes(1)
  })

  it('logs and does not postMessage when iframe is missing', async () => {
    const { iframeWindow, console } = await setupCrmMessenger({
      config: { initRetryIntervalMs: 10, initMaxAttempts: 1 },
      hasIframe: false
    })

    vi.advanceTimersByTime(15)

    expect(iframeWindow.postMessage).not.toHaveBeenCalled()
    expect(console.debug).toHaveBeenCalledWith(
      '[crm iframe]:',
      expect.stringContaining('No iframe available'),
      expect.any(Object)
    )
  })

  it('warns on unknown message types', async () => {
    const { sendMessage, console } = await setupCrmMessenger()
    sendMessage({ type: 'SOMETHING_ELSE' })

    expect(console.warn).toHaveBeenCalledWith(
      '[crm iframe]:',
      'No handler for message type',
      'SOMETHING_ELSE'
    )
  })

  it('surfaces postMessage errors when handling READY', async () => {
    const { sendMessage } = await setupCrmMessenger({
      beforeLoad: ({ iframeWindow }) => {
        iframeWindow.postMessage.mockImplementation(() => {
          throw new Error('some error')
        })
      }
    })

    expect(() => sendMessage({ type: 'READY' })).toThrow('some error')
  })

  it('catches and logs initialisation errors (e.g. listener registration failure)', async () => {
    const { console } = await setupCrmMessenger({
      beforeLoad: ({ parent }) => {
        parent.addEventListener.mockImplementation(() => {
          throw new Error('some error')
        })
      }
    })

    expect(console.error).toHaveBeenCalledWith(
      '[crm iframe]:',
      'Error initialising iframe messaging',
      expect.any(Error)
    )
  })
})
