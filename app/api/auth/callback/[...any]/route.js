import { createSession, getToken } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET(req) {
  const code = req.nextUrl.searchParams.get('code')

  if (!code) {
    return NextResponse.json({ error: 'Missing auth code' }, { status: 400 })
  }

  try {
    const result = await getToken(code)
    await createSession(result.account.username.toLowerCase())

    return NextResponse.redirect(new URL('/', req.nextUrl.origin))
  } catch (err) {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}
