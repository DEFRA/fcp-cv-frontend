'use client'

import Link from 'next/link'

export default function AppLink({ text, location }) {
  return (
    <Link
      className="text-blue-700 underline underline-offset-2 hover:text-blue-900 visited:text-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      href={location}
    >
      {text}
    </Link>
  )
}
