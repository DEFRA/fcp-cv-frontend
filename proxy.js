import { getSession } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function proxy(req) {
  const session = await getSession()

  if (!session?.email) {
    return NextResponse.redirect(
      new URL('/api/auth/sign-in', req.nextUrl.origin)
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/agreements',
    '/applications',
    '/business-messages',
    '/county-parish-holdings',
    '/land-details',
    '/linked-contacts',
    '/authenticate',
    '/linked-businesses'
  ]
}
