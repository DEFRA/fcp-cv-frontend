'use client'

import { ToastContainer, toast } from 'react-toastify'

const CloseButton = ({ closeToast }) => (
  <button
    class="Toastify__close-button Toastify__close-button--light h-full top-0! p-5!"
    type="button"
    aria-label="close"
    onClick={closeToast}
  >
    <svg aria-hidden="true" viewBox="0 0 14 16">
      <path
        fill-rule="evenodd"
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

export const notification = toast
