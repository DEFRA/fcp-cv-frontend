import { useSyncExternalStore } from 'react'

const originalPush = window.history.pushState

const emit = () => window.dispatchEvent(new Event('searchparamschange'))

window.history.pushState = function (...args) {
  originalPush.apply(this, args)
  emit()
}

export function useSearchParams() {
  return new URLSearchParams(
    useSyncExternalStore(
      (callback) => {
        window.addEventListener('searchparamschange', callback)
        return () => window.removeEventListener('searchparamschange', callback)
      },
      () => window.location.search
    )
  )
}
