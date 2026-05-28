import { NextResponse } from 'next/server'

import { metrics } from '@/lib/metrics'

export async function middleware() {
  const start = Date.now()
  const res = await NextResponse.next()
  await metrics.millis('BffRequestTime', Date.now() - start, {
    StatusCode: String(res.status)
  })
  return res
}

export const config = {
  runtime: 'nodejs',
  matcher: '/api/:path*'
}
