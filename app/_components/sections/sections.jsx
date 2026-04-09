import { cn } from '@/lib/utils'

export function Sections({ srTitle, className, children }) {
  return (
    <div className="h-full group">
      {srTitle && (
        <>
          <title>{srTitle}</title>
          <h1 className="sr-only">{srTitle}</h1>
        </>
      )}
      <div
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

function Section({ srTitle, className, children, ...props }) {
  return (
    <section className={className} {...props}>
      {srTitle && <h2 className="sr-only">{srTitle}</h2>}
      {children}
    </section>
  )
}

export function FullWidthSection(props) {
  return (
    <Section
      data-slot="full"
      className={cn(
        'row-start-1 col-span-2 border-primary',
        'group-has-[[data-slot="left"],[data-slot="right"]]:border-b',
        'group-has-[[data-slot="left"],[data-slot="right"]]:pb-5'
      )}
      {...props}
    />
  )
}

export function LeftSection(props) {
  return (
    <Section
      data-slot="left"
      className={cn(
        'overflow-y-scroll',
        'row-start-2 col-start-1 border-primary border-r pr-5',
        'group-has-data-[slot="full"]:border-t',
        'group-has-data-[slot="full"]:pt-5'
      )}
      {...props}
    />
  )
}

export function RightSection(props) {
  return (
    <Section
      data-slot="right"
      className={cn(
        'overflow-y-scroll',
        'row-start-2 col-start-2 border-primary border-l pl-5',
        'group-has-data-[slot="full"]:border-t',
        'group-has-data-[slot="full"]:pt-5'
      )}
      {...props}
    />
  )
}
