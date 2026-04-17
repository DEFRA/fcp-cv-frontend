'use client'

import { ToastContainer, toast } from 'react-toastify'

/**
 * By providing the message, as the id to the toast, any duplicates will be filtered out, so the same
 * message is only rendered once (while the toast is displayed)
 */
const deduplicatedToastMessage = (fn) => (message, options) => {
  fn(message, { toastId: JSON.stringify(message), ...options })
}

export const notification = Object.assign(deduplicatedToastMessage(toast), {
  error: deduplicatedToastMessage(toast.error),
  warning: deduplicatedToastMessage(toast.warning),
  info: deduplicatedToastMessage(toast.info),
  success: deduplicatedToastMessage(toast.success)
})

const CloseButton = ({ closeToast }) => (
  <button
    className="Toastify__close-button Toastify__close-button--light h-full top-0! p-5!"
    type="button"
    aria-label="close"
    onClick={closeToast}
  >
    <svg aria-hidden="true" viewBox="0 0 14 16">
      <path
        fillRule="evenodd"
        d="M7.71 8.23l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75L1 11.98l3.75-3.75L1 4.48 2.48 3l3.75 3.75L9.98 3l1.48 1.48-3.75 3.75z"
      ></path>
    </svg>
  </button>
)

export default function Notifications() {
  const errorStyle = {
    error: 'bg-red-50 border-red-200 ',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
    default: 'bg-slate-50 border-slate-200'
  }

  return (
    <ToastContainer
      position="top-center"
      autoClose={false}
      className="w-full! m-0 p-0 px-2 left-0 right-0 top-0! transform-none"
      closeButton={CloseButton}
      toastClassName={({ type }) =>
        `w-full text-slate-900 flex items-center p-4 mt-2 relative rounded-md ${errorStyle[type]}`
      }
    />
  )
}
