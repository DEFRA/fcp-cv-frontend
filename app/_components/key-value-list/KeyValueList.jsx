import { cn } from '@/lib/utils'

export function KeyValueList({
  title,
  items = {},
  className,
  contentClassName
}) {
  return (
    <div className={cn('space-y-4', className)}>
      {title && <h2 className="text-3xl font-bold">{title}</h2>}

      <dl className={cn('grid gap-y-1', contentClassName)}>
        {Object.entries(items).map(([key, value]) => (
          <div key={key} className="grid grid-cols-[1fr_auto] gap-x-10">
            <dt className="font-bold">{key}</dt>
            <dd className="text-right tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
