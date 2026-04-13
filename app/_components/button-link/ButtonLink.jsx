'use client'

import { cn } from '@/lib/utils'

const className =
  'text-blue-700 underline underline-offset-2 cursor-pointer hover:text-blue-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'

/**
 * Renders a Button element styled as a link
 *
 * Respects all properties of a standard Button element.  Additional styling can be added by passing `className` field in props
 */
export function ButtonLink({ children, ...props }) {
  return (
    <button type="button" {...props} className={cn(className, props.className)}>
      {children}
    </button>
  )
}
