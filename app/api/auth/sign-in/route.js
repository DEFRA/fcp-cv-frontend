import { NextResponse } from 'next/server'

import { getSignInUrl } from '@/lib/auth'

export async function GET() {
  return NextResponse.redirect(await getSignInUrl())
}
