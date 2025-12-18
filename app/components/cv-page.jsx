import { cn } from '@/lib/utils'

export function CVPage({ srTitle, className, children }) {
  return (
    <div className="h-full group">
      {srTitle && <h1 className="sr-only">{srTitle}</h1>}
      <div
        data-slot="list-detail-view"
        className={cn(
          'h-full grid grid-rows-[auto_1fr] grid-cols-[calc(100%/3)_auto]',
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}

function CVPageSection({ srTitle, className, children, ...props }) {
  return (
    <section className={cn('p-5', className)} {...props}>
      {srTitle && <h2 className="sr-only">{srTitle}</h2>}
      {children}
    </section>
  )
}

export function CVPageFullWidth(props) {
  return (
    <>
      <CVPageSection
        data-slot="full"
        className={cn(
          'row-start-1 col-span-2 border-primary',
          'group-has-[[data-slot="left"],[data-slot="right"]]:border-b'
        )}
        {...props}
      />
    </>
  )
}

export function CVPageLeftColumn(props) {
  return (
    <CVPageSection
      data-slot="left"
      className={cn(
        'row-start-2 col-start-1 border-primary',
        'group-has-data-[slot="right"]:border-r',
        'group-has-data-[slot="full"]:border-t'
      )}
      {...props}
    />
  )
}

export function CVPageRightColumn(props) {
  return (
    <>
      <CVPageSection
        data-slot="right"
        className={cn(
          'row-start-2 col-start-2 border-primary',
          'group-has-data-[slot="right"]:border-l',
          'group-has-data-[slot="full"]:border-t'
        )}
        {...props}
      />
    </>
  )
}
