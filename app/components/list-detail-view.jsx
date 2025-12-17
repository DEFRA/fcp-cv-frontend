import { Children, isValidElement } from 'react'

export function ListDetailView({ srTitle, children }) {
  const sections = Children.toArray(children)
    .filter(isValidElement)
    .filter((child) => child.type === ListDetailViewSection)
    .slice(0, 2)

  return (
    <>
      {srTitle && <h1 className="sr-only">{srTitle}</h1>}
      <div className="grid grid-cols-[1fr_2fr] divide-x-2 divide-primary h-full py-5">
        {sections}
      </div>
    </>
  )
}

export function ListDetailViewSection({ srTitle, children }) {
  return (
    <section className="px-5 overflow-y-auto">
      <>
        {srTitle && <h2 className="sr-only">{srTitle}</h2>}
        {children}
      </>
    </section>
  )
}
