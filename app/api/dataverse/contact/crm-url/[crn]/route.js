import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { getCrmContactUrl } from '@/lib/crm'
import { lookupContactIdByCrn } from '@/lib/dataverse'
import { handleApiError } from '@/lib/api'

export async function GET(req, { params }) {
  const crn = (await params).crn
  const token = (await headers()).get('x-msal-access-token')

  try {
    const result = await lookupContactIdByCrn(crn, token)

    if (result.error) {
      return handleApiError(
        req,
        result.error,
        `Problem retrieving Account ID with CRN: ${crn}`,
        404
      )
    }

    return NextResponse.json({ url: getCrmContactUrl(result.id) })
  } catch (error) {
    return handleApiError(
      req,
      error,
      `Problem retrieving Account ID with CRN: ${crn}`
    )
  }
}
