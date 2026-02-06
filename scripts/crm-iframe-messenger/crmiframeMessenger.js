var IframeMessenger = (function () {
  const CONFIG = {
    iframeControlName: 'IFRAME_local_react_4000',
    iframeOrigin: 'http://localhost:4000',
    initRetryIntervalMs: 500,
    initMaxAttempts: 20,
    logPrefix: '[crm iframe]:'
  }

  const state = {
    listenerRegistered: false,
    iframeWindow: null,
    formContext: null,
    initIntervalId: null,
    initAttempts: 0,
    initAcked: false
  }

  function setConfig(partial) {
    if (!partial || typeof partial !== 'object') return
    for (const k in partial) {
      if (Object.prototype.hasOwnProperty.call(partial, k)) {
        CONFIG[k] = partial[k]
      }
    }
  }

  function getIframeWindow(formContext) {
    const iframeControl = formContext?.getControl(CONFIG.iframeControlName)
    const contentWindow = iframeControl?.getObject()?.contentWindow

    if (!contentWindow) return null
    state.iframeWindow = contentWindow

    return state.iframeWindow
  }

  function postToIframe(type, payload) {
    if (!state.formContext) {
      console.debug(
        CONFIG.logPrefix,
        `No form context: unable to send "${type}" message to iframe`,
        { payload }
      )
      return
    }

    if (!state.iframeWindow) {
      console.debug(
        CONFIG.logPrefix,
        `No iframe available: unable to send "${type}" message to iframe`,
        { payload }
      )
      return
    }

    try {
      console.info(CONFIG.logPrefix, `sending "${type}" to iframe`, payload)
      state.iframeWindow.postMessage(
        {
          type: type,
          payload
        },
        CONFIG.iframeOrigin
      )
    } catch (e) {
      console.error(CONFIG.logPrefix, `sending "${type}" to iframe failed`, e)
      throw e
    }
  }

  function stopInitLoop() {
    if (state.initIntervalId) {
      clearInterval(state.initIntervalId)
      state.initIntervalId = null
    }
    state.initAttempts = 0
  }

  function sendInit() {
    if (!state?.formContext?.data?.entity) {
      console.debug(
        CONFIG.logPrefix,
        'Invalid form context: unable to send "INIT" message to iframe',
        { formContext: state.formContext }
      )
      return false
    }

    const payload = {
      entityName: state.formContext.data.entity.getEntityName(),
      recordId: state.formContext.data.entity.getId()
    }

    postToIframe('INIT', payload)
  }

  function startInitLoop() {
    stopInitLoop()
    state.initAttempts = 0
    state.initAcked = false

    state.initIntervalId = setInterval(function () {
      state.initAttempts += 1

      if (!state.iframeWindow) getIframeWindow(state.formContext)

      if (!state.initAcked) sendInit()

      if (state.initAttempts >= CONFIG.initMaxAttempts) {
        stopInitLoop()
        console.error(
          CONFIG.logPrefix,
          'iframe did not ACK INIT in time; stopping retries',
          {
            iframeControlName: CONFIG.iframeControlName,
            iframeOrigin: CONFIG.iframeOrigin,
            attempts: CONFIG.initMaxAttempts
          }
        )
      }
    }, CONFIG.initRetryIntervalMs)
  }

  function handleMessage(event) {
    if (!event?.origin || event?.origin !== CONFIG.iframeOrigin) {
      console.debug(
        CONFIG.logPrefix,
        'Unable to handle message as invalid origin:',
        event?.origin
      )
      return
    }

    if (state.iframeWindow && event.source !== state.iframeWindow) {
      console.debug(
        CONFIG.logPrefix,
        'Unable to handle message as invalid source:',
        event.source
      )
      return
    }

    const data = event.data
    const isValid = data?.type && typeof data?.type === 'string'
    if (!isValid) {
      console.debug(
        CONFIG.logPrefix,
        'Unable to handle message as invalid message format:',
        data
      )
      return
    }

    console.info(CONFIG.logPrefix, `"${data.type}" message recieved`, data)
    switch (data.type) {
      case 'READY': {
        sendInit()
        break
      }

      case 'INIT_ACK': {
        state.initAcked = true
        stopInitLoop()
        break
      }

      default: {
        console.warn(CONFIG.logPrefix, 'No handler for message type', data.type)
        break
      }
    }
  }

  function registerListener() {
    if (state.listenerRegistered) {
      console.debug(
        CONFIG.logPrefix,
        'Unable to register message listener as already registered'
      )
      return
    }
    try {
      console.debug(CONFIG.logPrefix, 'Registering message listener')
      window.parent.addEventListener('message', handleMessage)
      state.listenerRegistered = true
    } catch (e) {
      console.error(CONFIG.logPrefix, 'Error registering message listener', e)
      throw e
    }
  }

  function onLoad(executionContext) {
    try {
      console.info(CONFIG.logPrefix, 'Initialising iframe messaging')
      state.formContext =
        executionContext && executionContext.getFormContext
          ? executionContext.getFormContext()
          : null
      if (!state.formContext) return

      registerListener()
      getIframeWindow(state.formContext)
      startInitLoop()
    } catch (e) {
      console.error(CONFIG.logPrefix, 'Error initialising iframe messaging', e)
    }
  }

  return {
    configure: setConfig,
    onLoad: onLoad
  }
})()
