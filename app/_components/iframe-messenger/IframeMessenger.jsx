'use client'

import pino from 'pino'
import { useEffect } from 'react'

const logPrefix = '[nextjs iframe]:'

const logger = pino()

export function IframeMessenger({ crmOrigin }) {
  useEffect(() => {
    logger.info(logPrefix, 'Initialising iframe messaging')

    if (!crmOrigin) {
      logger.warn(
        logPrefix,
        'crmOrigin is not defined, iframe messaging disabled'
      )
      return
    }

    const postToParent = (type, payload = {}) => {
      logger.info(logPrefix, `sending "${type}" to CRM`, payload)
      window.parent.postMessage(
        {
          type: type,
          payload
        },
        crmOrigin
      )
    }

    function handleMessage(event) {
      if (crmOrigin !== event?.origin) {
        logger.debug(logPrefix, 'Invalid message origin', event?.origin)
        return
      }
      if (event.source.top !== window.parent) {
        logger.debug(logPrefix, 'Invalid message source', event.source.top)
        return
      }

      const data = event.data
      const isValid = data?.type && typeof data?.type === 'string'
      if (!isValid) {
        logger.debug(logPrefix, 'Invalid message:', data)
        return
      }

      logger.info(logPrefix, `"${data.type}" message recieved`, data)
      switch (data.type) {
        case 'INIT':
          postToParent('INIT_ACK')
          break
        default:
          logger.warn(
            logPrefix,
            `No message handler for message "${data.type}"`
          )
          break
      }
    }

    logger.debug(logPrefix, 'adding "message" listener')
    window.addEventListener('message', handleMessage)

    postToParent('READY')

    return () => {
      logger.debug(logPrefix, 'removing "message" listener')
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  return null // This component only listens and sends messages
}
