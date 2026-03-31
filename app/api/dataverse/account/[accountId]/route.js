import { config } from '@/config'
import { handleApiError, notFound } from '@/lib/api'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(req, { params }) {
  const { accountId } = await params

  try {
    const requestHeaders = await headers()
    const token = requestHeaders.get('x-msal-access-token')
    if (!token)
      return unauthorised(
        req,
        new Error('Cannot call dataverse, no MSAL token in headers'),
        'Missing MSAL access token in request headers'
      )

    const response = await fetch(
      `${config.get('dataverse.url')}/accounts(${accountId})?$select=rpa_sbinumber`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    const data = await response.json()

    if (!data?.rpa_sbinumber) {
      return notFound(
        req,
        new Error(
          `Problem retrieving business SBI for account ID: ${accountId}`
        ),
        'Dataverse record has no CRN for this contact'
      )
    }

    return NextResponse.json({ sbi: data?.rpa_sbinumber })
  } catch (error) {
    return handleApiError(
      req,
      error,
      `Problem retrieving business SBI for account ID: ${accountId}`
    )
  }
}
