import { getEmailFromToken } from '@/lib/token.js'
import { NextResponse } from 'next/server'

export async function GET() {
  const email = await getEmailFromToken()

  console.log('email:', email)

  return NextResponse.json([
    { firstName: 'Merl', lastName: 'Kemmer', crn: '1103020285' },
    { firstName: 'Kailey', lastName: 'Olson', crn: '8562286973' },
    { firstName: 'Yolanda', lastName: 'Sawayn-Cummerata', crn: '1638563942' },
    { firstName: 'Zetta', lastName: 'Hayes-Witting', crn: '3170633316' },
    { firstName: 'Nona', lastName: 'Ward', crn: '1343571956' }
  ])
}
