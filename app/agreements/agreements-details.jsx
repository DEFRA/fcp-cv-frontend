'use client'

import {
  KeyValueList,
  KeyValueListContent,
  KeyValueListItem,
  KeyValueListTitle
} from '@/components/key-value-list-v2/key-value-list'
import Table from '@/components/table/Table'
import { useDal } from '@/hooks/data'
import { useSearchParams } from '@/hooks/search-params'
import { ButtonLink } from '@/components/button-link/ButtonLink'
import { useEffect } from 'react'
import { notification } from '@/components/notification/Notifications.jsx'

const defaultAgreementSummary = [
  { dt: 'Agreement Reference' },
  { dt: 'Status' },
  { dt: 'Type' },
  { dt: 'Start Date' },
  { dt: 'Scheme Year' },
  { dt: 'End Date' }
]

export function AgreementsDetails() {
  const { searchParams, unsetSearchParam } = useSearchParams()

  const contractId = searchParams.get('contractId')

  const sbi = searchParams.get('sbi')
  const { data = { details: {} }, isLoading } = useDal(['agreements', sbi])
  const summary = data.details[contractId]?.summary ?? defaultAgreementSummary

  useEffect(() => {
    if (!isLoading) {
      if (!data?.details || Object.keys(data.details).length === 0) {
        notification.error(`Business with SBI ${sbi} not found.`)
      } else if (!data.details[contractId]) {
        notification.error(
          `No agreements found for SBI ${sbi} and Contract Id ${contractId}.`
        )
      }
    }
  }, [data, isLoading, sbi, contractId])

  return (
    <div className="space-y-6">
      <ButtonLink
        className="mb-2"
        onClick={() => unsetSearchParam('contractId')}
      >
        {'< Back to Agreements list'}
      </ButtonLink>

      <KeyValueList>
        <KeyValueListTitle loading={isLoading}>
          {data.details[contractId]?.name}
        </KeyValueListTitle>
        <KeyValueListContent columns={2}>
          {summary.map((item) => (
            <KeyValueListItem key={item.dt} {...item} loading={isLoading} />
          ))}
        </KeyValueListContent>
      </KeyValueList>

      <Table
        loading={isLoading}
        data={data.details[contractId]?.paymentSchedules || Array(10).fill({})}
        columns={[
          { header: 'Sheet', accessorKey: 'sheetName' },
          { header: 'Parcel', accessorKey: 'parcelName' },
          { header: 'Description', accessorKey: 'optionDescription' },
          { header: 'Action Area (ha)', accessorKey: 'actionArea' },
          { header: 'Action Length (m)', accessorKey: 'actionMTL' },
          { header: 'Action Units', accessorKey: 'actionUnits' },
          { header: 'Parcel Area (ha)', accessorKey: 'parcelTotalArea' },
          { header: 'Payment Schedule', accessorKey: 'paymentSchedule' },
          { header: 'Commitment Term', accessorKey: 'commitmentTerm' }
        ]}
        enableSorting={false}
        searchBarClassName="ml-0"
      />
    </div>
  )
}
