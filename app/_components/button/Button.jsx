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

export function Button({ children, href }) {
  const styles = cn(
    'inline-flex items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-10 py-6 text-lg font-semibold text-gray-950 shadow-sm transition-colors',
    'hover:bg-gray-50 active:bg-gray-100',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-60'
  )

  return (
    <Link
      href={href}
      className={styles}
      target="_blank"
      rel="noreferrer noopener"
    >
      <span>{children}</span>
      <ExternalLinkIcon className="shrink-0" />
    </Link>
  )
}
