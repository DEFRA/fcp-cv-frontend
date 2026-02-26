import { config } from '@/config'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(_, { params }) {
  const token = (await headers()).get('x-msal-access-token')

  const response = await fetch(
    `${config.get('dataverse.url')}/contacts(${(await params).contactId})?$select=rpa_capcustomerid`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  return NextResponse.json(await response.json())
}
