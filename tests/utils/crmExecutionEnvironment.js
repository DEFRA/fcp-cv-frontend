import { readFile } from 'node:fs/promises'
import path from 'node:path'
import vm from 'node:vm'
import { act, createElement } from 'react'

export const IFRAME_CONTROL_NAME = 'IFRAME_local_react_4000'
export const IFRAME_ORIGIN = 'http://localhost:4000'
export const DEFAULT_INIT_MESSAGE = {
  type: 'INIT',
  payload: { entityName: 'account', recordId: '{record-id}' }
}

export async function mountIframeMessenger({
  window: win = globalThis.window,
  crmOrigin
} = {}) {
  if (!win?.document) {
    throw new Error(
      'mountIframeMessenger requires a DOM window. Run this test with the jsdom environment.'
    )
  }

  const container = win.document.createElement('div')
  win.document.body.appendChild(container)

  const { createRoot } = await import('react-dom/client')
  const root = createRoot(container)

  const { IframeMessenger } =
    await import('../../app/_components/iframe-messenger/IframeMessenger.jsx')

  await act(async () => {
    root.render(createElement(IframeMessenger, { crmOrigin }))
  })

  return {
    window: win,
    container,
    root,
    unmount: async () => {
      await act(async () => {
        root.unmount()
      })
    }
  }
}

function createCrmMocks() {
  const parent = { addEventListener: vi.fn() }
  const iframeWindow = { postMessage: vi.fn() }
  const console = {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  }

  return { parent, iframeWindow, console }
}

function createSandbox({ parent, console, windowOverrides } = {}) {
  return {
    window: { parent, ...(windowOverrides ?? {}) },
    console,
    setInterval: globalThis.setInterval,
    clearInterval: globalThis.clearInterval
  }
}

async function loadIframeMessenger({ windowOverrides } = {}) {
  const scriptPath = path.resolve(
    process.cwd(),
    'scripts',
    'crm-iframe-messenger',
    'crmiframeMessenger.js'
  )
  const script = await readFile(scriptPath, 'utf8')
  const { parent, iframeWindow, console } = createCrmMocks()
  const sandbox = createSandbox({ parent, console, windowOverrides })

  vm.createContext(sandbox)
  vm.runInContext(script, sandbox, {
    filename: 'crmiframeMessenger.js'
  })

  return {
    sandbox,
    IframeMessenger: sandbox.IframeMessenger,
    parent,
    iframeWindow,
    console
  }
}

function createExecutionContext({ iframeWindow, hasIframe = true } = {}) {
  const iframeControl = hasIframe
    ? {
        getObject: () => ({ contentWindow: iframeWindow })
      }
    : null

  const formContext = {
    getControl: vi.fn().mockReturnValue(iframeControl),
    data: {
      entity: {
        getEntityName: vi.fn().mockReturnValue('account'),
        getId: vi.fn().mockReturnValue('{record-id}')
      }
    }
  }

  const executionContext = {
    getFormContext: vi.fn().mockReturnValue(formContext)
  }

  return { executionContext, formContext }
}

function getMessageEventHandler(parentWindow) {
  for (const [eventName, handler] of parentWindow.addEventListener.mock.calls) {
    if (eventName === 'message') return handler
  }
}

function createMessageSender({ handler, iframeWindow } = {}) {
  return function sendMessage(event = {}) {
    if (!handler) throw new Error('Message handler was not registered')

    let data = {}
    if (event.data) data = event.data
    if (event.type) data = { type: event.type }
    if (event.payload) data.payload = event.payload

    return handler({
      origin: event.origin ?? IFRAME_ORIGIN,
      source: event.source ?? iframeWindow,
      data
    })
  }
}

export async function setupCrmMessenger({
  config,
  hasIframe = true,
  onLoadTimes = 1,
  beforeLoad,
  windowOverrides
} = {}) {
  const { IframeMessenger, parent, iframeWindow, console } =
    await loadIframeMessenger({ windowOverrides })

  if (config) IframeMessenger.configure(config)

  const { executionContext, formContext } = createExecutionContext({
    iframeWindow,
    hasIframe
  })

  if (beforeLoad) {
    beforeLoad({
      IframeMessenger,
      parent,
      iframeWindow,
      console,
      executionContext,
      formContext
    })
  }

  for (let i = 0; i < onLoadTimes; i += 1) {
    IframeMessenger.onLoad(executionContext)
  }

  const handler = getMessageEventHandler(parent)

  return {
    IframeMessenger,
    parent,
    iframeWindow,
    console,
    executionContext,
    formContext,
    handler,
    sendMessage: createMessageSender({ handler, iframeWindow })
  }
}

export async function setupCrmWithIframeMessenger({
  crmOrigin,
  iframeOrigin = IFRAME_ORIGIN,
  crmConfig,
  initRetryIntervalMs = 10,
  initMaxAttempts = 50
} = {}) {
  if (!crmOrigin) {
    throw new Error('setupCrmWithIframeMessenger requires `crmOrigin`')
  }

  const iframeWin = globalThis.window
  if (!iframeWin?.dispatchEvent) {
    throw new Error(
      'setupCrmWithIframeMessenger requires a DOM window. Run this test with the jsdom environment.'
    )
  }

  const postToCrmSpy = vi.spyOn(iframeWin, 'postMessage')

  const crm = await setupCrmMessenger({
    config: {
      initRetryIntervalMs,
      initMaxAttempts,
      iframeOrigin,
      ...(crmConfig ?? {})
    },
    beforeLoad: ({ iframeWindow }) => {
      iframeWindow.postMessage.mockImplementation((data, targetOrigin) => {
        if (targetOrigin !== iframeOrigin) return

        iframeWin.dispatchEvent(
          new iframeWin.MessageEvent('message', {
            origin: crmOrigin,
            source: { top: iframeWin },
            data
          })
        )
      })
    }
  })

  postToCrmSpy.mockImplementation((data, targetOrigin) => {
    if (targetOrigin !== crmOrigin) return
    return crm.sendMessage({ origin: iframeOrigin, data })
  })

  await mountIframeMessenger({ window: iframeWin, crmOrigin })

  return {
    crm,
    iframe: {
      window: iframeWin,
      parent: iframeWin
    }
  }
}
