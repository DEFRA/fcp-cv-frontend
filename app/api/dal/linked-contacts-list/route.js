import { getEmailFromToken } from '@/lib/auth.js'
import { headers } from 'next/headers.js'
import { NextResponse } from 'next/server'

/**
 * Example API route to fetch data from DAL
 * DAL requires passing an app token and the email of the user
 */
export async function GET() {
  await getEmailFromToken(await headers())

  // Fetch data from the DAL:
  // const data = fetch('http://fcp-dal-api', {
  //   method: 'POST',
  //   headers: {
  //     email,
  //     authorization: `Bearer ${token}` // Need to get a token for this!
  //   },
  //   body: {
  //     query: '',
  //     variables: {}
  //   }
  // })

  return NextResponse.json([
    { firstName: 'Merl', lastName: 'Kemmer', crn: '1103020285' },
    { firstName: 'Kailey', lastName: 'Olson', crn: '8562286973' },
    { firstName: 'Yolanda', lastName: 'Sawayn-Cummerata', crn: '1638563942' },
    { firstName: 'Zetta', lastName: 'Hayes-Witting', crn: '3170633316' },
    { firstName: 'Nona', lastName: 'Ward', crn: '1343571956' }
  ])
}
