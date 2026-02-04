'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'

function ExternalLinkIcon({ className }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      focusable="false"
      className={cn('h-5 w-5', className)}
    >
      <path
        d="M11 3h6v6m0-6L9 11"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 4H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const className = cn(
  'inline-flex items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-10 py-6 text-lg font-semibold text-gray-950 shadow-sm transition-colors cursor-pointer',
  'hover:bg-gray-50 active:bg-gray-100',
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2',
  'disabled:cursor-not-allowed disabled:opacity-60'
)

export function ExternalLinkButton({ href, children, ...props }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={className}
      {...props}
    >
      {children}
      <ExternalLinkIcon className="shrink-0" />
    </Link>
  )
}

export function Button({ onClick, children, ...props }) {
  return (
    <button onClick={onClick} className={className} {...props}>
      {children}
    </button>
  )
}
