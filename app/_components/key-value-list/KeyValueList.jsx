export function KeyValueList({ title, items = {} }) {
  return (
    <div className="space-y-4">
      {title && <h2 className="text-3xl font-bold">{title}</h2>}

      <dl className="grid gap-y-1">
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
