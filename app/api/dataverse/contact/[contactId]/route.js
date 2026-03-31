import { config } from '@/config'
import { handleApiError, notFound, unauthorised } from '@/lib/api'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(req, { params }) {
  const { contactId } = await params

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
      `${config.get('dataverse.url')}/contacts(${contactId})?$select=rpa_capcustomerid`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    const data = await response.json()

    if (!data?.rpa_capcustomerid) {
      return notFound(
        req,
        new Error(
          `Problem retrieving customer CRN for contact ID: ${contactId}`
        ),
        'Dataverse record has no CRN for this contact'
      )
    }

    return NextResponse.json({ crn: data?.rpa_capcustomerid })
  } catch (error) {
    return handleApiError(
      req,
      error,
      `Problem retrieving customer CRN for contact ID: ${contactId}`
    )
  }
}
