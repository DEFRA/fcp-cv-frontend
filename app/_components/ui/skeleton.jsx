import { cn } from '@/lib/utils'

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn('bg-gray-200 animate-pulse rounded-md', className)}
      {...props}
    />
  )
}
