import { cn } from '@/lib/utils'

export function CVPage({ srTitle, className, children }) {
  return (
    <div className="h-full">
      {srTitle && <h1 className="sr-only">{srTitle}</h1>}
      <div
        data-slot="list-detail-view"
        className={cn(
          'grid h-full py-5',
          'grid-cols-1 grid-flow-col',
          'has-data-[slot=detail]:grid-cols-[[list]1fr_[divider]2px_[detail]2fr]',
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
    <section className={cn('px-5', className)} {...props}>
      {srTitle && <h2 className="sr-only">{srTitle}</h2>}
      {children}
    </section>
  )
}

export function CVPageList(props) {
  return (
    <CVPageSection data-slot="list" className={'col-start-[list]'} {...props} />
  )
}

export function CVPageDetail(props) {
  return (
    <>
      <div className="bg-primary col-start-[divider]" aria-hidden="true" />
      <CVPageSection
        data-slot="detail"
        className="col-start-[detail]"
        {...props}
      />
    </>
  )
}
