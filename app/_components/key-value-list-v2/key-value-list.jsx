import { Skeleton } from '@/components/skeleton/skeleton'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export function KeyValueList({ children }) {
  return <div className="space-y-4">{children}</div>
}

export function KeyValueListTitle({ children, loading }) {
  return (
    <Skeleton className="h-8 w-50" loading={loading}>
      <h2 className="text-2xl font-bold">{children}</h2>
    </Skeleton>
  )
}

export function KeyValueListContent({ children, columns = 1 }) {
  return (
    <dl
      className={cn(
        'grid gap-x-10 gap-y-2',
        columns === 1 && 'grid-cols-[auto_1fr]',
        columns === 2 && 'grid-cols-[auto_1fr_auto_1fr]'
      )}
    >
      {children}
    </dl>
  )
}

export function KeyValueListItem({ dt, dd, loading, children }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <dt className="font-bold">{dt}</dt>

      <dd className="tabular-nums">
        <Skeleton loading={loading} className="h-4 w-30">
          {children ? (
            <div>
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                className="flex items-center gap-3 cursor-pointer"
              >
                <span>{dd}</span>

                <svg
                  className={cn([
                    'size-5 transition-transform duration-200',
                    isOpen ? 'rotate-180' : ''
                  ])}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              <div
                className={`
                grid overflow-hidden transition-all duration-300 ease-in-out
                ${isOpen ? 'grid-rows-[1fr] mt-2' : 'grid-rows-[0fr] mt-0'}
                `}
              >
                <div className="min-h-0">{children}</div>
              </div>
            </div>
          ) : (
            <div>{dd}</div>
          )}
        </Skeleton>
      </dd>
    </>
  )
}
