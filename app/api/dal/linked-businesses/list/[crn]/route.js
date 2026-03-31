import { dalRequest } from '@/lib/dal'
import { logger } from '@/lib/logger'
import { NextResponse } from 'next/server'

const query = `#graphql
  query CVLinkedBusinessesList($crn: ID!) {
    customer(crn: $crn) {
      businesses {
        sbi
        name
      }
    }
  }
`

export async function GET(req, { params }) {
  const { crn } = await params

  try {
    const response = await dalRequest({ query, variables: { crn } })

    const { data, errors } = response
    if (errors?.length) {
      const error = errors.map((er) => er.stack).join('\n')
      logger.warn(
        { error, req },
        `Problem retrieving customers for business with SBI: ${sbi}`
      )
      return Response.error(
        { message: 'Error fetching customers', error },
        { status: 500 }
      )
    }

    return Response.json(data?.customer?.businesses ?? [])
  } catch ({ name, message, stack, status, statusText }) {
    logger.warn(
      {
        error: { id: status, message, stack_trace: stack },
        req
      },
      `Problem retrieving customers for business with SBI: ${sbi}`
    )
    return NextResponse.json(
      { error: `${name} ${message}` },
      { status, statusText }
    )
  }
}
