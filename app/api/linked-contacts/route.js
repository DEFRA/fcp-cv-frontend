import { NextResponse } from 'next/server'

import { getEmailFromToken } from '@/lib/token'

export async function GET() {
  const email = await getEmailFromToken()
  console.log(email)

  return NextResponse.json([1, 2, 3, 4, 5])
}
