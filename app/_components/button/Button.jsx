'use client'

import { cn } from '@/lib/utils'

const className = cn(
  'inline-flex items-center justify-center gap-3 rounded-lg border shadow-sm',
  'border-gray-300 bg-white px-6 py-4 font-semibold text-gray-950',
  'active:bg-gray-100 transition-colors cursor-pointer hover:bg-gray-50',
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-green-700',
  'focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'
)

export function LinkButton({ href, children, ...props }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={className}
      {...props}
    >
      {children}
    </a>
  )
}

export function Button({ onClick, children, ...props }) {
  return (
    <button onClick={onClick} className={className} {...props}>
      {children}
    </button>
  )
}
