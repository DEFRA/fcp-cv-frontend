import Link from 'next/link'

export default function ConsolidatedViewPage() {
  return (
    <div className="m-10">
      <div>
        <h1 className="text-3xl font-bold mb-5">Consolidated View</h1>
        <h2 className="text-xl font-semibold">Apps</h2>
        <ul className="list-disc list-inside ml-5">
          <li>
            <Link href="/linked-contacts">Linked Contacts</Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
