import Table from '@/components/table/Table'

const columns = [
  { header: 'CRN', accessorKey: 'crn' },
  { header: 'First Name', accessorKey: 'firstName' },
  { header: 'Last Name', accessorKey: 'lastName' }
]

export async function LinkedContactsList() {
  const data = await new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { firstName: 'Merl', lastName: 'Kemmer', crn: '1103020285' },
        { firstName: 'Kailey', lastName: 'Olson', crn: '8562286973' },
        {
          firstName: 'Yolanda',
          lastName: 'Sawayn-Cummerata',
          crn: '1638563942'
        },
        { firstName: 'Zetta', lastName: 'Hayes-Witting', crn: '3170633316' },
        { firstName: 'Nona', lastName: 'Ward', crn: '1343571956' }
      ])
    }, 1000)
  })

  return <Table data={data} columns={columns} />
}

export async function LinkedContactsListSkeleton() {
  return <div>LinkedContactsListSkeleton</div>
}
