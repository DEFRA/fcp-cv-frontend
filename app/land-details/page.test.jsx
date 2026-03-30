import { AuthProvider } from '@/components/auth/auth-provider'
import Notifications from '@/components/notification/Notifications'
import { http, HttpResponse } from 'msw'
import { SWRConfig } from 'swr'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { testWithWorker } from '../../test/test-with-worker'
import Page from './page.jsx'

const mockLandDetails = {
  parcels: [
    {
      id: 'SS6-836',
      sheetId: 'SS6',
      parcelId: '836',
      area: 1.6939,
      pendingDigitisation: false
    },
    {
      id: 'SS6-856',
      sheetId: 'SS6',
      parcelId: '856',
      area: 4.0797,
      pendingDigitisation: true
    },
    {
      id: 'SS6-852',
      sheetId: 'SS6',
      parcelId: '852',
      area: 5.893,
      pendingDigitisation: false
    }
  ],
  summary: {
    totalParcels: 3,
    totalArea: 11.6666,
    arableLandArea: 228.2947,
    permanentGrasslandArea: 530.1988,
    permanentCropsArea: 7.3368,
    pendingParcels: 1
  },
  landCovers: [
    { code: '110', name: 'Arable Land', area: 228.2947 },
    { code: '120', name: 'Permanent Grassland', area: 530.1988 },
    { code: '130', name: 'Permanent Crop Land', area: 7.3368 }
  ]
}

const mockLandDetailsHistorical = {
  parcels: [
    {
      id: 'SS6-836',
      sheetId: 'SS6',
      parcelId: '836',
      area: 1.6939,
      pendingDigitisation: false
    }
  ],
  summary: {
    totalParcels: 1,
    totalArea: 1.6939,
    arableLandArea: 100.0,
    permanentGrasslandArea: 200.0,
    permanentCropsArea: 5.0,
    pendingParcels: 0
  },
  landCovers: [
    { code: '110', name: 'Arable Land', area: 100.0 },
    { code: '120', name: 'Permanent Grassland', area: 200.0 },
    { code: '130', name: 'Permanent Crop Land', area: 5.0 }
  ]
}

const mockParcelDetail836 = {
  parcel: {
    sheetId: 'SS6',
    parcelId: '836',
    area: 1.6939,
    pendingDigitisation: false,
    effectiveFromDate: '15/11/2021',
    effectiveToDate: '14/11/2021'
  },
  parcelCovers: [
    { code: '110', name: 'Arable Land', area: 0.8699 },
    { code: '130', name: 'Permanent Grassland', area: 0.679 }
  ],
  parcelLandUses: [
    {
      code: 'AC01',
      type: 'Area',
      area: 0.8699,
      startDate: '15/11/2021',
      endDate: '14/11/2022',
      insertDate: '01/01/2021',
      deleteDate: ''
    }
  ]
}

const mockParcelDetail852 = {
  parcel: {
    sheetId: 'SS6',
    parcelId: '852',
    area: 5.893,
    pendingDigitisation: false,
    effectiveFromDate: '01/01/2022',
    effectiveToDate: '31/12/2022'
  },
  parcelCovers: [],
  parcelLandUses: []
}

const mockParcelDetail856 = {
  parcel: {
    sheetId: 'SS6',
    parcelId: '856',
    area: 4.0797,
    pendingDigitisation: true,
    effectiveFromDate: '01/01/2020',
    effectiveToDate: '31/12/2022'
  },
  parcelCovers: [{ code: '120', name: 'Permanent Grassland', area: 4.0797 }],
  parcelLandUses: []
}

describe('LandDetailsPage tests', () => {
  beforeEach(() => {
    window.history.pushState(null, '', '/')
  })

  testWithWorker(
    'renders the full page layout with summary, parcel list, and auto-selected first parcel detail',
    async ({ worker }) => {
      worker.use(
        http.get(
          '/api/dataverse/account/8b725f88-1562-4d4c-8c21-c185e46fa56c',
          () => HttpResponse.json({ sbi: '123456789' })
        ),
        http.get('/api/dal/land-details/123456789', () =>
          HttpResponse.json(mockLandDetails)
        ),
        http.get('/api/dal/land-parcel/123456789', () =>
          HttpResponse.json(mockParcelDetail836)
        )
      )

      window.history.pushState(
        null,
        '',
        `?id=8b725f88-1562-4d4c-8c21-c185e46fa56c&typename=account`
      )

      const { getByRole, getByText, getByLabelText } = await render(
        <SWRConfig value={{ provider: () => new Map() }}>
          <AuthProvider config={{ disabled: true }}>
            <Page />
          </AuthProvider>
        </SWRConfig>
      )

      await expect
        .element(getByRole('heading', { name: 'Land Details' }))
        .toBeInTheDocument()

      await expect.element(getByLabelText('Date')).toBeInTheDocument()

      await expect
        .element(getByRole('heading', { name: 'Land Summary', exact: true }))
        .toBeInTheDocument()

      await expect
        .element(getByText('Total Number of Parcels'))
        .toBeInTheDocument()
      await expect.element(getByText('3', { exact: true })).toBeInTheDocument()

      await expect.element(getByText('Total Area (ha)')).toBeInTheDocument()
      await expect
        .element(getByText('11.6666', { exact: true }))
        .toBeInTheDocument()

      await expect
        .element(
          getByText('Total Parcels With Pending Customer Notified Land Changes')
        )
        .toBeInTheDocument()
      await expect.element(getByText('1', { exact: true })).toBeInTheDocument()

      await expect
        .element(getByRole('cell', { name: '228.2947' }))
        .toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: '530.1988' }))
        .toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: '7.3368' }))
        .toBeInTheDocument()

      await expect
        .element(getByText('Sheet', { exact: true }))
        .toBeInTheDocument()
      await expect
        .element(getByText('Parcel', { exact: true }))
        .toBeInTheDocument()
      await expect
        .element(getByText('Land Change?', { exact: true }))
        .toBeInTheDocument()

      await expect
        .element(getByRole('cell', { name: '836' }))
        .toBeInTheDocument()

      await expect
        .element(getByRole('heading', { name: 'SS6 836' }))
        .toBeInTheDocument()
      await expect.element(getByText('Effective Date From')).toBeInTheDocument()
      await expect
        .element(getByText('14/11/2021', { exact: true }))
        .toBeInTheDocument()
    }
  )

  testWithWorker(
    'shows and updates the detail panel when parcels are selected',
    async ({ worker }) => {
      worker.use(
        http.get(
          '/api/dataverse/account/8b725f88-1562-4d4c-8c21-c185e46fa56c',
          () => HttpResponse.json({ sbi: '123456789' })
        ),
        http.get('/api/dal/land-details/123456789', () =>
          HttpResponse.json(mockLandDetails)
        ),
        http.get('/api/dal/land-parcel/123456789', ({ request }) => {
          const { searchParams } = new URL(request.url)
          if (searchParams.get('parcelId') === '856') {
            return HttpResponse.json(mockParcelDetail856)
          }
          return HttpResponse.json(mockParcelDetail836)
        })
      )

      window.history.pushState(
        null,
        '',
        `?id=8b725f88-1562-4d4c-8c21-c185e46fa56c&typename=account`
      )

      const { getByRole, getByText } = await render(
        <SWRConfig value={{ provider: () => new Map() }}>
          <AuthProvider config={{ disabled: true }}>
            <Page />
          </AuthProvider>
        </SWRConfig>
      )

      await expect
        .element(getByRole('heading', { name: 'SS6 836' }))
        .toBeInTheDocument()
      await expect
        .element(getByText('14/11/2021', { exact: true }))
        .toBeInTheDocument()

      await getByRole('cell', { name: '856' }).click()

      await expect
        .element(getByRole('heading', { name: 'SS6 856' }))
        .toBeInTheDocument()
      await expect
        .element(getByText('01/01/2020', { exact: true }))
        .toBeInTheDocument()
      await expect
        .element(getByText('31/12/2022', { exact: true }))
        .toBeInTheDocument()
    }
  )

  testWithWorker(
    'shows parcel covers and land uses in the detail panel for the auto-selected parcel',
    async ({ worker }) => {
      worker.use(
        http.get(
          '/api/dataverse/account/8b725f88-1562-4d4c-8c21-c185e46fa56c',
          () => HttpResponse.json({ sbi: '123456789' })
        ),
        http.get('/api/dal/land-details/123456789', () =>
          HttpResponse.json(mockLandDetails)
        ),
        http.get('/api/dal/land-parcel/123456789', () =>
          HttpResponse.json(mockParcelDetail836)
        )
      )

      window.history.pushState(
        null,
        '',
        `?id=8b725f88-1562-4d4c-8c21-c185e46fa56c&typename=account`
      )

      const { getByRole } = await render(
        <SWRConfig value={{ provider: () => new Map() }}>
          <AuthProvider config={{ disabled: true }}>
            <Page />
          </AuthProvider>
        </SWRConfig>
      )

      await expect
        .element(getByRole('heading', { name: 'SS6 836' }))
        .toBeInTheDocument()

      await expect
        .element(getByRole('cell', { name: '110' }).first())
        .toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: '0.679' }))
        .toBeInTheDocument()

      await expect
        .element(getByRole('cell', { name: 'AC01' }))
        .toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: '14/11/2022' }))
        .toBeInTheDocument()
    }
  )

  testWithWorker(
    'shows pending digitisation status and no land uses message when switching parcels',
    async ({ worker }) => {
      worker.use(
        http.get(
          '/api/dataverse/account/8b725f88-1562-4d4c-8c21-c185e46fa56c',
          () => HttpResponse.json({ sbi: '123456789' })
        ),
        http.get('/api/dal/land-details/123456789', () =>
          HttpResponse.json(mockLandDetails)
        ),
        http.get('/api/dal/land-parcel/123456789', ({ request }) => {
          const { searchParams } = new URL(request.url)
          if (searchParams.get('parcelId') === '856') {
            return HttpResponse.json(mockParcelDetail856)
          }
          return HttpResponse.json(mockParcelDetail836)
        })
      )

      window.history.pushState(
        null,
        '',
        `?id=8b725f88-1562-4d4c-8c21-c185e46fa56c&typename=account`
      )

      const { getByRole, getByText } = await render(
        <SWRConfig value={{ provider: () => new Map() }}>
          <AuthProvider config={{ disabled: true }}>
            <Page />
          </AuthProvider>
        </SWRConfig>
      )

      await expect
        .element(getByRole('heading', { name: 'SS6 836' }))
        .toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: 'No' }).first())
        .toBeInTheDocument()

      await getByRole('cell', { name: '856' }).click()

      await expect
        .element(getByRole('heading', { name: 'SS6 856' }))
        .toBeInTheDocument()
      await expect
        .element(getByRole('cell', { name: 'Yes' }))
        .toBeInTheDocument()
      await expect.element(getByText('No land uses found')).toBeInTheDocument()
    }
  )

  testWithWorker(
    'shows no land covers found in the detail panel when the selected parcel has no covers',
    async ({ worker }) => {
      worker.use(
        http.get(
          '/api/dataverse/account/8b725f88-1562-4d4c-8c21-c185e46fa56c',
          () => HttpResponse.json({ sbi: '123456789' })
        ),
        http.get('/api/dal/land-details/123456789', () =>
          HttpResponse.json(mockLandDetails)
        ),
        http.get('/api/dal/land-parcel/123456789', ({ request }) => {
          const { searchParams } = new URL(request.url)
          if (searchParams.get('parcelId') === '852') {
            return HttpResponse.json(mockParcelDetail852)
          }
          return HttpResponse.json(mockParcelDetail836)
        })
      )

      window.history.pushState(
        null,
        '',
        `?id=8b725f88-1562-4d4c-8c21-c185e46fa56c&typename=account`
      )

      const { getByRole, getByText } = await render(
        <SWRConfig value={{ provider: () => new Map() }}>
          <AuthProvider config={{ disabled: true }}>
            <Page />
          </AuthProvider>
        </SWRConfig>
      )

      await getByRole('cell', { name: '852' }).click()

      await expect
        .element(getByRole('heading', { name: 'SS6 852' }))
        .toBeInTheDocument()
      await expect
        .element(getByText('No land covers found'))
        .toBeInTheDocument()
    }
  )

  testWithWorker(
    'shows empty state messages and hides the detail panel when there are no parcels',
    async ({ worker }) => {
      worker.use(
        http.get(
          '/api/dataverse/account/8b725f88-1562-4d4c-8c21-c185e46fa56c',
          () => HttpResponse.json({ sbi: '123456789' })
        ),
        http.get('/api/dal/land-details/123456789', () =>
          HttpResponse.json({
            parcels: [],
            summary: { totalParcels: 0, totalArea: 0, pendingParcels: 0 },
            landCovers: []
          })
        )
      )

      window.history.pushState(
        null,
        '',
        `?id=8b725f88-1562-4d4c-8c21-c185e46fa56c&typename=account`
      )

      const { getByRole, getByText } = await render(
        <SWRConfig value={{ provider: () => new Map() }}>
          <AuthProvider config={{ disabled: true }}>
            <Page />
          </AuthProvider>
        </SWRConfig>
      )

      await expect
        .element(getByRole('heading', { name: 'SS6 836' }))
        .not.toBeInTheDocument()
      await expect.element(getByText('No parcels found')).toBeInTheDocument()
      await expect.element(getByText('No land cover data')).toBeInTheDocument()
    }
  )

  testWithWorker(
    'updates all data when the date is changed',
    async ({ worker }) => {
      worker.use(
        http.get(
          '/api/dataverse/account/8b725f88-1562-4d4c-8c21-c185e46fa56c',
          () => HttpResponse.json({ sbi: '123456789' })
        ),
        http.get('/api/dal/land-details/123456789', ({ request }) => {
          const { searchParams } = new URL(request.url)
          if (searchParams.get('date') === '2021-11-15') {
            return HttpResponse.json(mockLandDetailsHistorical)
          }
          return HttpResponse.json(mockLandDetails)
        }),
        http.get('/api/dal/land-parcel/123456789', () =>
          HttpResponse.json(mockParcelDetail836)
        )
      )

      window.history.pushState(
        null,
        '',
        `?id=8b725f88-1562-4d4c-8c21-c185e46fa56c&typename=account`
      )

      const { getByText, getByLabelText } = await render(
        <SWRConfig value={{ provider: () => new Map() }}>
          <AuthProvider config={{ disabled: true }}>
            <Page />
          </AuthProvider>
        </SWRConfig>
      )

      await expect.element(getByText('3', { exact: true })).toBeInTheDocument()
      await expect
        .element(getByText('11.6666', { exact: true }))
        .toBeInTheDocument()
      await expect
        .element(getByText('530.1988', { exact: true }))
        .toBeInTheDocument()

      await userEvent.fill(getByLabelText('Date'), '2021-11-15')
      await userEvent.keyboard('{Enter}')

      await expect
        .element(getByText('11.6666', { exact: true }))
        .not.toBeInTheDocument()
      await expect
        .element(getByText('530.1988', { exact: true }))
        .not.toBeInTheDocument()
      await expect.element(getByText('0', { exact: true })).toBeInTheDocument()
    }
  )

  testWithWorker(
    'caches parcel requests and does not re-fetch land details when rows are clicked',
    async ({ worker }) => {
      let landDetailsCount = 0
      let landParcelCount = 0

      worker.use(
        http.get(
          '/api/dataverse/account/8b725f88-1562-4d4c-8c21-c185e46fa56c',
          () => HttpResponse.json({ sbi: '123456789' })
        ),
        http.get('/api/dal/land-details/123456789', () => {
          landDetailsCount++
          return HttpResponse.json(mockLandDetails)
        }),
        http.get('/api/dal/land-parcel/123456789', ({ request }) => {
          landParcelCount++
          const { searchParams } = new URL(request.url)
          if (searchParams.get('parcelId') === '856') {
            return HttpResponse.json(mockParcelDetail856)
          }
          return HttpResponse.json(mockParcelDetail836)
        })
      )

      window.history.pushState(
        null,
        '',
        `?id=8b725f88-1562-4d4c-8c21-c185e46fa56c&typename=account`
      )

      const { getByRole } = await render(
        <SWRConfig value={{ provider: () => new Map() }}>
          <AuthProvider config={{ disabled: true }}>
            <Page />
          </AuthProvider>
        </SWRConfig>
      )

      await expect
        .element(getByRole('heading', { name: 'SS6 836' }))
        .toBeInTheDocument()

      await expect
        .element(getByRole('cell', { name: '0.8699' }).first())
        .toBeInTheDocument()

      const landDetailsAfterLoad = landDetailsCount
      const landParcelAfterLoad = landParcelCount

      await getByRole('cell', { name: '856' }).click()
      await expect
        .element(getByRole('heading', { name: 'SS6 856' }))
        .toBeInTheDocument()

      await getByRole('cell', { name: '836' }).click()
      await expect
        .element(getByRole('heading', { name: 'SS6 836' }))
        .toBeInTheDocument()

      await getByRole('cell', { name: '856' }).click()
      await expect
        .element(getByRole('heading', { name: 'SS6 856' }))
        .toBeInTheDocument()

      expect(landDetailsCount).toBe(landDetailsAfterLoad)
      expect(landParcelCount).toBe(landParcelAfterLoad + 1)
    }
  )

  testWithWorker(
    'shows a warning notification when a date before the minimum is entered',
    async ({ worker }) => {
      worker.use(
        http.get(
          '/api/dataverse/account/8b725f88-1562-4d4c-8c21-c185e46fa56c',
          () => HttpResponse.json({ sbi: '123456789' })
        ),
        http.get('/api/dal/land-details/123456789', () =>
          HttpResponse.json(mockLandDetails)
        ),
        http.get('/api/dal/land-parcel/123456789', () =>
          HttpResponse.json(mockParcelDetail836)
        )
      )

      window.history.pushState(
        null,
        '',
        `?id=8b725f88-1562-4d4c-8c21-c185e46fa56c&typename=account`
      )

      const { getByLabelText, getByText } = await render(
        <SWRConfig value={{ provider: () => new Map() }}>
          <AuthProvider config={{ disabled: true }}>
            <Page />
            <Notifications />
          </AuthProvider>
        </SWRConfig>
      )

      await userEvent.fill(getByLabelText('Date'), '2014-12-31')
      await userEvent.keyboard('{Enter}')

      await expect
        .element(
          getByText(
            'Date is before the minimum allowed date. It has been reset to the minimum date: 01/01/2015.'
          )
        )
        .toBeInTheDocument()
    }
  )

  testWithWorker(
    'shows a warning notification when a date after the maximum is entered',
    async ({ worker }) => {
      worker.use(
        http.get(
          '/api/dataverse/account/8b725f88-1562-4d4c-8c21-c185e46fa56c',
          () => HttpResponse.json({ sbi: '123456789' })
        ),
        http.get('/api/dal/land-details/123456789', () =>
          HttpResponse.json(mockLandDetails)
        ),
        http.get('/api/dal/land-parcel/123456789', () =>
          HttpResponse.json(mockParcelDetail836)
        )
      )

      window.history.pushState(
        null,
        '',
        `?id=8b725f88-1562-4d4c-8c21-c185e46fa56c&typename=account`
      )

      const today = new Date().toISOString().split('T')[0]
      const [year, month, day] = today.split('-')
      const formattedToday = `${day}/${month}/${year}`

      const { getByLabelText, getByText } = await render(
        <SWRConfig value={{ provider: () => new Map() }}>
          <AuthProvider config={{ disabled: true }}>
            <Page />
            <Notifications />
          </AuthProvider>
        </SWRConfig>
      )

      await userEvent.fill(getByLabelText('Date'), '2099-01-01')
      await userEvent.keyboard('{Enter}')

      await expect
        .element(
          getByText(
            `Date is before the maximum allowed date. It has been reset to the maximum date: ${formattedToday}.`
          )
        )
        .toBeInTheDocument()
    }
  )

  it('renders the page component with content', async () => {
    const { getByRole } = await render(<Page />)

    await expect
      .element(getByRole('heading', { name: 'Land details' }))
      .toBeInTheDocument()

    /* Uncomment and test when land details page is complete
    await expect
      .element(getByText('Date')) // Date label
      .toBeInTheDocument()

    await expect
      .element(getByLabel('Date')) // Date filter
      .toBeInTheDocument()

    await expect
      .element(getByRole( 'heading', { name: 'Land Summary' }))
      .toHaveClass(/font-bold/)

    await expect
      .element(getByRole('heading', { name: 'Land details' }))
      .toBeInTheDocument()

    await expect
      .element(getByText('Total Number of Parcels')) // label
      .toBeInTheDocument()

    await expect
      .element(getByLabel('Total Number of Parcels')) // value
      .not.toBeEmpty()

    await expect
      .element(getByText('Total Area (ha)')) // label
      .toBeInTheDocument()

    await expect
      .element(getByLabel('Total Area (ha)')) // value
      .not.toBeEmpty()

    await expect
      .element(getByText('Total Parcels with Pending Customer Notified Land Changes')) // label
      .toBeInTheDocument()

    await expect
      .element(getByLabel('Total Parcels with Pending Customer Notified Land Changes')) // value
      .not.toBeEmpty()

    await expect
      .element(getByRole('table')) // 'Land Summary' table, Needs to be refactored as there are more than one table on this page
      .toBeInTheDocument()

    await expect
      .element(getByRole('button', { name: 'Code'})) // Table header is a th/button/span
      .toBeInTheDocument()

    await expect
      .element(getByRole('button', { name: 'Land Cover'})) // Table header is a th/button/span
      .toBeInTheDocument()

    await expect
      .element(getByRole('button', { name: 'Area (ha)'})) // Table header is a th/button/span
      .toBeInTheDocument()

    // TODO
    // And I see a Parcels pane

    await expect
      .element(getByRole('table')) // 'Parcels' table, Needs to be refactored as there are more than one table on this page
      .toBeInTheDocument()

    await expect
      .element(getByText('Search')) // Search label
      .toBeInTheDocument()

    await expect
      .element(getByLabel('Search')) // Search box
      .toBeEmpty()

    await expect
      .element(getByRole('button', { name: 'Sheet'})) // Table header is a th/button/span
      .toBeInTheDocument()

    await expect
      .element(getByRole('button', { name: 'Parcel'})) // Table header is a th/button/span
      .toBeInTheDocument()

    await expect
      .element(getByRole('button', { name: 'Area (ha)'})) // Table header is a th/button/span
      .toBeInTheDocument()

    await expect
      .element(getByRole('button', { name: 'Land Change?'})) // Table header is a th/button/span
      .toBeInTheDocument()
    */
  })

  it('renders the parcel summary section correctly', async () => {
    const { getByRole } = await render(<Page />)

    /* Uncomment and test when land details page is complete
    await getByRole('table'). // 'Parcels' table, Needs to be refactored as there are more than one table on this page
      .getByRole('row')
      .nth(1) // Get the first data row
      .click()

    const selectedParcelSheetAndCode = 'AAA BBB' // Need to seed some data and add this - concatenation of the sheet and parcel codes selected
    await expect
      .element(getByRole( 'heading', { name: selectedParcelSheetAndCode })) // This text selector is data-reliant, brittle?
      .toHaveClass(/font-bold/)

    await expect
      .element(getByText('Area (ha)')) // label
      .toBeInTheDocument()

    await expect
      .element(getByLabel('Area (ha)')) // value
      .not.toBeEmpty()

    await expect
      .element(getByText('Pending Customer Notified Land Change?')) // label
      .toBeInTheDocument()

    await expect
      .element(getByLabel('Pending Customer Notified Land Change?')) // value
      .not.toBeEmpty()

    await expect
      .element(getByText('Effective Date From')) // label
      .toBeInTheDocument()

    await expect
      .element(getByLabel('Effective Date From')) // value
      .not.toBeEmpty()

    await expect
      .element(getByText('Effective Date To')) // label
      .toBeInTheDocument()

    await expect
      .element(getByLabel('Effective Date To')) // value
      .not.toBeEmpty()

    await expect
      .element(getByRole('table')) // 'Parcel summary' table, Needs to be refactored as there are more than one table on this page
      .toBeInTheDocument()

     await expect
       .element(getByRole('button', { name: 'Code'})) // Table header is a th/button/span
       .toBeInTheDocument()

     await expect
       .element(getByRole('button', { name: 'Land Cover'})) // Table header is a th/button/span
       .toBeInTheDocument()

     await expect
       .element(getByRole('button', { name: 'Area (ha)'})) // Table header is a th/button/span
       .toBeInTheDocument()
    */
  })
})
