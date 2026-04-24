'use client'

import { cn } from '@/lib/utils'

const className = cn(
  'inline-flex items-center justify-center gap-3 rounded-lg border shadow-sm',
  'border-gray-300 bg-white px-6 py-4 font-semibold text-gray-950',
  'active:bg-gray-100 transition-colors cursor-pointer hover:bg-gray-50',
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-green-700',
  'focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'
)

export function Button({ children, loading, ...props }) {
  return (
    <button
      {...props}
      className={cn(className, props.className)}
      disabled={loading || props.disabled}
    >
      {loading ? <>Loading&hellip;</> : children}
    </button>
  )
}
