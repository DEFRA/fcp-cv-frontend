import { cn } from '@/lib/utils'

export function Skeleton({ className, loading, children, ...props }) {
  if (loading) {
    return (
      <div
        data-slot="skeleton"
        className={cn('bg-gray-200 animate-pulse rounded-md', className)}
        {...props}
      />
    )
  }

  return children
}
