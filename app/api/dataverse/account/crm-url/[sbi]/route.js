import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { getCrmAccountUrl } from '@/lib/crm'
import { lookupAccountIdBySbi } from '@/lib/dataverse'

export async function GET(_, { params }) {
  const token = (await headers()).get('x-msal-access-token')

  const result = await lookupAccountIdBySbi((await params).sbi, token)

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 404 })
  }

  return NextResponse.json({ url: getCrmAccountUrl(result.id) })
}
