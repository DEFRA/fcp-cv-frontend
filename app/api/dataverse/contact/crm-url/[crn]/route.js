import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { getCrmContactUrl } from '@/lib/crm'
import { lookupContactIdByCrn } from '@/lib/dataverse'

export async function GET(_, { params }) {
  const token = (await headers()).get('x-msal-access-token')

  const result = await lookupContactIdByCrn((await params).crn, token)

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 404 })
  }

  return NextResponse.json({ url: getCrmContactUrl(result.id) })
}
