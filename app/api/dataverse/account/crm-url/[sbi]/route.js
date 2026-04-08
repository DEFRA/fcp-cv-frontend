import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { getCrmAccountUrl } from '@/lib/crm'
import { lookupAccountIdBySbi } from '@/lib/dataverse'
import { handleApiError } from '@/lib/api'

export async function GET(req, { params }) {
  const sbi = (await params).sbi
  const token = (await headers()).get('x-msal-access-token')

  try {
    const result = await lookupAccountIdBySbi(sbi, token)

    if (result.error) {
      return handleApiError(
        req,
        result.error,
        `Problem retrieving Account ID with SBI: ${sbi}`,
        404
      )
    }

    return NextResponse.json({ url: getCrmAccountUrl(result.id) })
  } catch (error) {
    return handleApiError(
      req,
      error,
      `Problem retrieving Account ID with SBI: ${sbi}`
    )
  }
}
