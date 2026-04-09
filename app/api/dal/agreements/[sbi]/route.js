import { dalRequest } from '@/lib/dal'
import { formatDate } from '@/lib/formatters'

const query = `#graphql
  query CVAgreements($sbi: ID!) {
    business(sbi: $sbi) {
      agreements {
        contractId
        name
        status
        contractType
        schemeYear
        startDate
        endDate
        paymentSchedules {
          optionCode
          optionDescription
          commitmentGroupStartDate
          commitmentGroupEndDate
          year
          sheetName
          parcelName
          actionArea
          actionMTL
          actionUnits
          parcelTotalArea
          startDate
          endDate
        }
      }
    }
  }
`

const PAYMENT_SCHEDULE_SORT_FIELDS = [
  'sheetName',
  'parcelName',
  'optionDescription',
  'startDate',
  'endDate'
]

function toListItem({
  contractId,
  schemeYear,
  name,
  contractType,
  startDate,
  endDate,
  status
}) {
  return {
    contractId,
    schemeYear,
    name,
    contractType,
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    status
  }
}

function toSummary({
  contractId,
  status,
  contractType,
  startDate,
  schemeYear,
  endDate
}) {
  return [
    { dt: 'Agreement Reference', dd: contractId },
    { dt: 'Status', dd: status },
    { dt: 'Type', dd: contractType },
    { dt: 'Start Date', dd: formatDate(startDate) },
    { dt: 'Scheme Year', dd: schemeYear },
    { dt: 'End Date', dd: formatDate(endDate) }
  ]
}

function sortPaymentSchedules(a, b) {
  for (const field of PAYMENT_SCHEDULE_SORT_FIELDS) {
    const aVal = a[field] ?? ''
    const bVal = b[field] ?? ''
    if (aVal < bVal) return -1
    if (aVal > bVal) return 1
  }
  return 0
}

function toPaymentScheduleRow(ps) {
  return {
    sheetName: ps.sheetName,
    parcelName: ps.parcelName,
    optionDescription: ps.optionDescription,
    actionArea: ps.actionArea,
    actionMTL: ps.actionMTL,
    actionUnits: ps.actionUnits,
    parcelTotalArea: ps.parcelTotalArea,
    paymentSchedule: `${formatDate(ps.startDate)} - ${formatDate(ps.endDate)}`,
    commitmentTerm: `${formatDate(ps.commitmentGroupStartDate)} - ${formatDate(ps.commitmentGroupEndDate)}`
  }
}

export async function GET(_, { params }) {
  const response = await dalRequest({ query, variables: await params })

  const agreements = (response?.data?.business?.agreements || []).sort(
    (a, b) => (b.schemeYear ?? 0) - (a.schemeYear ?? 0)
  )

  return Response.json(
    agreements.reduce(
      ({ list, details }, agreement) => ({
        list: [...list, toListItem(agreement)],
        details: {
          ...details,
          [agreement.contractId]: {
            name: agreement.name,
            summary: toSummary(agreement),
            paymentSchedules: (agreement.paymentSchedules || [])
              .sort(sortPaymentSchedules)
              .map(toPaymentScheduleRow)
          }
        }
      }),
      { list: [], details: {} }
    )
  )
}
