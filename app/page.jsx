import { headers } from 'next/headers'
import Link from 'next/link'

import { SignInButton } from '@/components/auth/sign-in-button.jsx'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation.js'

const businessLinks = [
  {
    name: 'Agreements',
    href: '/agreements'
  },
  {
    name: 'Applications',
    href: '/applications'
  },
  {
    name: 'Business Messages',
    href: '/business-messages'
  },
  {
    name: 'County Parish Holdings (CPH)',
    href: '/county-parish-holdings'
  },
  {
    name: 'Land Details',
    href: '/land-details'
  },
  {
    name: 'Linked Contacts',
    href: '/linked-contacts'
  }
]

const customerLinks = [
  {
    name: 'Authenticate',
    href: '/authenticate'
  },
  {
    name: 'Linked Businesses',
    href: '/linked-businesses'
  }
]

export default async function ConsolidatedViewPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect('/sign-in')
  }

  return (
    <div className="m-10">
      <div>
        <h1 className="text-3xl font-bold mb-5">Consolidated View</h1>
        <h2 className="text-xl font-semibold mb-3">Apps</h2>

        <SignInButton email={session?.user?.email} />

        <div className="flex gap-10">
          <div>
            <h3 className="text-lg font-semibold">Business</h3>
            <ul className="list-disc list-inside ml-5">
              {businessLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="underline">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Customer</h3>
            <ul className="list-disc list-inside ml-5">
              {customerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="underline">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
