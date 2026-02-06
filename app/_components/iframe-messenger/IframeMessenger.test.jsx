// @vitest-environment jsdom

import { act } from 'react'
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi
} from 'vitest'
import {
  DEFAULT_INIT_MESSAGE,
  IFRAME_ORIGIN,
  mountIframeMessenger,
  setupCrmWithIframeMessenger
} from '../../../tests/utils/crmExecutionEnvironment.js'

vi.mock('@elastic/ecs-pino-format', () => ({
  ecsFormat: () => ({})
}))

vi.mock('pino', () => ({
  default: vi.fn(() => ({
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn()
  }))
}))

const CRM_ORIGIN = 'https://crm.example.test'

function spyOnMessagingWindowApis() {
  const postMessageSpy = vi
    .spyOn(window.parent, 'postMessage')
    .mockImplementation(() => {})
  const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
  const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

  return { postMessageSpy, addEventListenerSpy, removeEventListenerSpy }
}

async function unmountReactRoot(root) {
  await act(async () => {
    root.unmount()
  })
}

describe('IframeMessenger', () => {
  const originalIsReactActEnvironment = globalThis.IS_REACT_ACT_ENVIRONMENT

  beforeAll(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true
  })

  afterAll(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = originalIsReactActEnvironment
  })

  afterEach(() => {
    globalThis.document?.body && (globalThis.document.body.innerHTML = '')
    vi.restoreAllMocks()
  })

  it('posts READY on mount and manages the message listener lifecycle', async () => {
    vi.resetModules()

    const { postMessageSpy, addEventListenerSpy, removeEventListenerSpy } =
      spyOnMessagingWindowApis()

    const { root } = await mountIframeMessenger({ crmOrigin: CRM_ORIGIN })

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'message',
      expect.any(Function)
    )
    expect(postMessageSpy).toHaveBeenCalledWith(
      { type: 'READY', payload: {} },
      CRM_ORIGIN
    )

    await unmountReactRoot(root)

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'message',
      expect.any(Function)
    )
  })

  it('disables iframe messaging when crmOrigin is not defined', async () => {
    vi.resetModules()
    const { postMessageSpy, addEventListenerSpy, removeEventListenerSpy } =
      spyOnMessagingWindowApis()

    const { root } = await mountIframeMessenger({ crmOrigin: null })

    expect(addEventListenerSpy).not.toHaveBeenCalledWith(
      'message',
      expect.any(Function)
    )
    expect(postMessageSpy).not.toHaveBeenCalled()

    await unmountReactRoot(root)

    expect(removeEventListenerSpy).not.toHaveBeenCalledWith(
      'message',
      expect.any(Function)
    )
  })

  it('responds to INIT with INIT_ACK when origin/source are valid', async () => {
    vi.resetModules()

    const postMessageSpy = vi
      .spyOn(window.parent, 'postMessage')
      .mockImplementation(() => {})

    await mountIframeMessenger({ crmOrigin: CRM_ORIGIN })

    window.dispatchEvent(
      new window.MessageEvent('message', {
        origin: CRM_ORIGIN,
        source: window,
        data: { type: 'INIT' }
      })
    )

    expect(postMessageSpy).toHaveBeenCalledWith(
      { type: 'INIT_ACK', payload: {} },
      CRM_ORIGIN
    )
  })

  it('ignores messages from an unexpected origin', async () => {
    vi.resetModules()

    const postMessageSpy = vi
      .spyOn(window.parent, 'postMessage')
      .mockImplementation(() => {})

    await mountIframeMessenger({ crmOrigin: CRM_ORIGIN })

    window.dispatchEvent(
      new window.MessageEvent('message', {
        origin: 'https://not-crm.example.test',
        source: window,
        data: { type: 'INIT' }
      })
    )

    expect(postMessageSpy).not.toHaveBeenCalledWith(
      { type: 'INIT_ACK', payload: {} },
      CRM_ORIGIN
    )
  })

  it('ignores messages from an unexpected source', async () => {
    vi.resetModules()

    const postMessageSpy = vi
      .spyOn(window.parent, 'postMessage')
      .mockImplementation(() => {})

    await mountIframeMessenger({ crmOrigin: CRM_ORIGIN })

    window.dispatchEvent(
      new window.MessageEvent('message', {
        origin: CRM_ORIGIN,
        source: { top: {} },
        data: { type: 'INIT' }
      })
    )

    expect(postMessageSpy).not.toHaveBeenCalledWith(
      { type: 'INIT_ACK', payload: {} },
      CRM_ORIGIN
    )
  })

  it('ignores messages with an invalid payload shape', async () => {
    vi.resetModules()

    const postMessageSpy = vi
      .spyOn(window.parent, 'postMessage')
      .mockImplementation(() => {})

    await mountIframeMessenger({ crmOrigin: CRM_ORIGIN })

    window.dispatchEvent(
      new window.MessageEvent('message', {
        origin: CRM_ORIGIN,
        source: window,
        data: { type: 123 }
      })
    )

    window.dispatchEvent(
      new window.MessageEvent('message', {
        origin: CRM_ORIGIN,
        source: window,
        data: {}
      })
    )

    expect(postMessageSpy).not.toHaveBeenCalledWith(
      { type: 'INIT_ACK', payload: {} },
      CRM_ORIGIN
    )
  })
})

describe('IframeMessenger ↔ IframeMessenger integration', () => {
  // const originalCrmOrigin = process.env.NEXT_PUBLIC_CRM_ORIGIN
  const originalIsReactActEnvironment = globalThis.IS_REACT_ACT_ENVIRONMENT

  beforeAll(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true
  })

  afterAll(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = originalIsReactActEnvironment
  })

  beforeEach(() => {
    vi.useFakeTimers()
    // process.env.NEXT_PUBLIC_CRM_ORIGIN = CRM_ORIGIN
  })

  afterEach(() => {
    vi.useRealTimers()
    // process.env.NEXT_PUBLIC_CRM_ORIGIN = originalCrmOrigin
    vi.restoreAllMocks()
  })

  it('performs READY → INIT → INIT_ACK handshake and stops INIT retries', async () => {
    vi.resetModules()

    const { crm, iframe } = await setupCrmWithIframeMessenger({
      crmOrigin: CRM_ORIGIN,
      iframeOrigin: IFRAME_ORIGIN,
      initRetryIntervalMs: 10,
      initMaxAttempts: 50
    })

    expect(iframe.parent.postMessage).toHaveBeenCalledWith(
      { type: 'READY', payload: {} },
      CRM_ORIGIN
    )

    expect(crm.iframeWindow.postMessage).toHaveBeenCalledWith(
      DEFAULT_INIT_MESSAGE,
      IFRAME_ORIGIN
    )

    expect(iframe.parent.postMessage).toHaveBeenCalledWith(
      { type: 'INIT_ACK', payload: {} },
      CRM_ORIGIN
    )

    const initCallsAfterAck = crm.iframeWindow.postMessage.mock.calls.length
    vi.advanceTimersByTime(100)
    expect(crm.iframeWindow.postMessage.mock.calls.length).toBe(
      initCallsAfterAck
    )
  })
})
