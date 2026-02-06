'use client'

export default function AppLink({ onClick, children }) {
  return (
    <button
      className="text-blue-700 underline underline-offset-2 hover:text-blue-900 visited:text-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      onClick={onClick}
    >
      {children}
    </button>
  )
}
