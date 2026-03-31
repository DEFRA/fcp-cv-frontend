import { config } from '@/config'
import { logger } from '@/lib/logger'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(req, { params }) {
  const { contactId } = await params

  try {
    const requestHeaders = await headers()
    const token = requestHeaders.get('x-msal-access-token')

    const response = await fetch(
      `${config.get('dataverse.url')}/contacts(${contactId})?$select=rpa_capcustomerid`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    const data = await response.json()

    return NextResponse.json({ crn: data?.rpa_capcustomerid })
  } catch (error) {
    logger.warn(
      { error, req },
      `Problem retrieving customer CRN for contact ID: ${contactId}`
    )
    return Response.error(
      { message: 'Error fetching customers', error },
      {
        status: error.status ?? 500,
        statusText: error.statusText ?? 'ServerError'
      }
    )
  }
}
