import { userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-react'

import Table from '@/components/table/Table'

describe('Table component tests', () => {
  const defaultData = [
    { firstName: 'Ada', lastName: 'Lovelace', age: 36 },
    { firstName: 'Grace', lastName: 'Hopper', age: 85 },
    { firstName: 'Alan', lastName: 'Turing', age: 41 }
  ]
  const defaultColumns = [
    { header: 'First name', accessorKey: 'firstName' },
    { header: 'Last name', accessorKey: 'lastName' },
    { header: 'Age', accessorKey: 'age', enableSorting: false }
  ]

  it('renders the table component with a message advising no data', async () => {
    const { getByText } = await render(<Table data={[]} columns={[]} />)

    await expect.element(getByText('No results found')).toBeInTheDocument()
  })

  describe('searching tests', () => {
    it('should add the search box by default', async () => {
      const { getByPlaceholder } = await render(
        <Table data={[]} columns={[]} />
      )

      await expect
        .element(getByPlaceholder('Enter search term'))
        .toBeInTheDocument()
    })

    it('allows disabling searching functionality', async () => {
      const { getByPlaceholder } = await render(
        <Table
          data={defaultData}
          columns={defaultColumns}
          enableSearching={false}
        />
      )

      await expect
        .element(getByPlaceholder('Enter search term'))
        .not.toBeInTheDocument()
    })

    it('filters rows to match search term', async () => {
      const { getByPlaceholder, getByRole } = await render(
        <Table data={defaultData} columns={defaultColumns} />
      )

      const rowLocators = getByRole('row')
      expect(rowLocators).toHaveLength(4) // 3 data rows + 1 header row

      // table data filters as search term changes...
      await userEvent.type(getByPlaceholder('Enter search term'), 'a')
      expect(rowLocators).toHaveLength(4) // 3 data rows + 1 header row
      await userEvent.type(getByPlaceholder('Enter search term'), 'ce')
      expect(rowLocators).toHaveLength(3) // 2 data row + 1 header row
      await expect
        .element(getByRole('row', { name: 'Ada Lovelace 36' }))
        .toBeInTheDocument()
      await expect
        .element(getByRole('row', { name: 'Grace Hopper 85' }))
        .toBeInTheDocument()
      await expect
        .element(getByRole('row', { name: 'Alan Turing 41' }))
        .not.toBeInTheDocument()
    })

    it('shows a message when no data matches search term', async () => {
      const { getByPlaceholder, getByRole, getByText } = await render(
        <Table data={[defaultData[0]]} columns={defaultColumns} />
      )

      const locator = getByRole('row', { name: 'Ada Lovelace 36' })
      await expect.element(locator).toBeInTheDocument()

      // search for nonexistent data...
      await userEvent.type(getByPlaceholder('Enter search term'), 'xyz')
      await expect.element(locator).not.toBeInTheDocument() // data is filtered out
      await expect.element(getByText('No results found')).toBeInTheDocument() // no data message shown
    })
  })

  describe('column sorting tests', () => {
    it('initially mirrors the data, when sorting is disabled', async () => {
      const { getByRole } = await render(
        <Table
          data={defaultData}
          columns={defaultColumns}
          enableSorting={false}
        />
      )

      const rowLocators = getByRole('row')
      expect(rowLocators).toHaveLength(4) // 3 data rows + 1 header row
      await expect(rowLocators.first()).toHaveTextContent(
        'First name' + 'Last name' + 'Age'
      )
      await expect
        .element(rowLocators.nth(1))
        .toHaveTextContent('Ada' + 'Lovelace' + '36')
      await expect
        .element(rowLocators.nth(2))
        .toHaveTextContent('Grace' + 'Hopper' + '85')
      await expect
        .element(rowLocators.last())
        .toHaveTextContent('Alan' + 'Turing' + '41')
    })

    it('initially orders rows according to the defaultSortColumn prop', async () => {
      const { getByRole } = await render(
        <Table
          data={defaultData}
          columns={defaultColumns}
          enableSorting
          defaultSortColumn="lastName"
        />
      )

      const rowLocators = getByRole('row')
      expect(rowLocators).toHaveLength(4) // 3 data rows + 1 header row
      await expect(rowLocators.first()).toHaveTextContent(
        'First name' + 'Last name' + 'Age'
      )
      // row content is ordered by age ascending (default sort direction)
      await expect
        .element(rowLocators.nth(1))
        .toHaveTextContent('Grace' + 'Hopper' + '85')
      await expect
        .element(rowLocators.nth(2))
        .toHaveTextContent('Ada' + 'Lovelace' + '36')
      await expect
        .element(rowLocators.last())
        .toHaveTextContent('Alan' + 'Turing' + '41')
    })

    it('column sorting can be individually disabled', async () => {
      const { getByRole } = await render(
        <Table data={defaultData} columns={defaultColumns} enableSorting />
      )

      const firstNameHdr = getByRole('cell', { name: 'First name' })
      await expect.element(firstNameHdr).toBeInTheDocument()
      const lastNameHdr = getByRole('cell', { name: 'Last name' })
      const ageHdr = getByRole('cell', { name: 'Age' })
      // sorting enabled for columns by default
      await expect.element(firstNameHdr.getByRole('button')).toBeInTheDocument()
      await expect.element(lastNameHdr.getByRole('button')).toBeInTheDocument()
      // sorting disabled for the Age column as per column definition
      await expect.element(ageHdr.getByRole('button')).not.toBeInTheDocument()
    })

    it('defaults to sorting by first column ascending (A-Z)', async () => {
      const { getByRole } = await render(
        <Table data={defaultData} columns={defaultColumns} />
      )

      const rowLocators = getByRole('row')
      expect(rowLocators).toHaveLength(4) // 3 data rows + 1 header row
      await expect(rowLocators.first()).toHaveTextContent(
        'First name' + 'Last name' + 'Age'
      )
      await expect
        .element(rowLocators.nth(1))
        .toHaveTextContent('Ada' + 'Lovelace' + '36')
      await expect
        .element(rowLocators.nth(2))
        .toHaveTextContent('Alan' + 'Turing' + '41')
      await expect
        .element(rowLocators.last())
        .toHaveTextContent('Grace' + 'Hopper' + '85')
    })

    it('allows sorting of table content by clicking column headers', async () => {
      const { getByRole } = await render(
        <Table data={defaultData} columns={defaultColumns} />
      )

      const rowLocators = getByRole('row')
      expect(rowLocators).toHaveLength(4) // 3 data rows + 1 header row
      await expect(rowLocators.first()).toHaveTextContent(
        'First name' + 'Last name' + 'Age'
      )

      // default order is by first name ascending (A-Z)
      await expect
        .element(rowLocators.nth(1))
        .toHaveTextContent('Ada' + 'Lovelace' + '36')
      await expect
        .element(rowLocators.nth(2))
        .toHaveTextContent('Alan' + 'Turing' + '41')
      await expect
        .element(rowLocators.last())
        .toHaveTextContent('Grace' + 'Hopper' + '85')

      const order = getByRole('button', { name: 'First name' })
      await expect.element(order).toBeInTheDocument()

      // click to change order, sort by first name descending (Z-A)
      await order.click({ force: true })
      await expect
        .element(rowLocators.nth(1))
        .toHaveTextContent('Grace' + 'Hopper' + '85')
      await expect
        .element(rowLocators.nth(2))
        .toHaveTextContent('Alan' + 'Turing' + '41')
      await expect
        .element(rowLocators.last())
        .toHaveTextContent('Ada' + 'Lovelace' + '36')

      // click to return row ordering to original data array order (remove sorting)
      await order.click({ force: true })
      await expect
        .element(rowLocators.nth(1))
        .toHaveTextContent('Ada' + 'Lovelace' + '36')
      await expect
        .element(rowLocators.nth(2))
        .toHaveTextContent('Grace' + 'Hopper' + '85')
      await expect
        .element(rowLocators.last())
        .toHaveTextContent('Alan' + 'Turing' + '41')

      // click to order again, sort by first name ascending (A-Z)
      await order.click({ force: true })
      await expect
        .element(rowLocators.nth(1))
        .toHaveTextContent('Ada' + 'Lovelace' + '36')
      await expect
        .element(rowLocators.nth(2))
        .toHaveTextContent('Alan' + 'Turing' + '41')
      await expect
        .element(rowLocators.last())
        .toHaveTextContent('Grace' + 'Hopper' + '85')
    })
  })

  it('handles various user interactions', async () => {
    const { getByPlaceholder, getByRole, getByText } = await render(
      <>
        <Table
          data={defaultData}
          columns={defaultColumns}
          enableSearching
          enableSorting
          defaultSortColumn="firstName"
          onRowClick={(row) => {
            const selectionElement = document.querySelector(
              '[data-testid="table-selection"]'
            )
            selectionElement.textContent = row
              ? `Table selection: ${row.firstName} ${row.lastName}, ${row.age}`
              : 'Table selection: none'
          }}
        />
        <div data-testid="table-selection">Table selection: none</div>
      </>
    )

    await expect
      .element(getByRole('row', { name: 'Ada Lovelace 36' }))
      .toBeInTheDocument()
    const rowLocators = getByRole('row')
    expect(rowLocators).toHaveLength(4) // 3 data rows + 1 header row
    await expect(rowLocators.first()).toHaveTextContent(
      'First nameLast nameAge'
    )
    await expect.element(rowLocators.nth(1)).toHaveTextContent('AdaLovelace36')
    await expect.element(rowLocators.nth(2)).toHaveTextContent('AlanTuring41')
    await expect.element(rowLocators.last()).toHaveTextContent('GraceHopper85')

    await expect.element(getByText('Table selection: none')).toBeInTheDocument()

    await expect
      .element(getByRole('cell', { name: 'Alan' }))
      .toBeInTheDocument()
    await getByRole('cell', { name: 'Alan' }).click()
    // TODO: add selected row highlight background colour so user can see selected row!
    // await expect
    //   .element(getByRole('row', { name: 'Alan' }))
    //   .toHaveClass('bg-gray-200')
    await expect
      .element(getByText('Table selection: Alan Turing, 41'))
      .toBeInTheDocument()

    await userEvent.keyboard('{Tab}')
    // TODO: add current row highlight background/border colour so user can see focused row!
    // await expect
    //   .element(getByRole('row', { name: 'Alan' }))
    //   .toHaveClass('bg-gray-200')
    await userEvent.keyboard('{Enter}')
    // TODO: add selected row highlight background colour so user can see selected row!
    // await expect
    //   .element(getByRole('row', { name: 'Grace' }))
    //   .toHaveClass('bg-gray-200')
    await expect
      .element(getByText('Table selection: Grace Hopper, 85'))
      .toBeInTheDocument()

    await userEvent.type(getByPlaceholder('Enter search term'), 'al')
    expect(rowLocators).toHaveLength(2) // 1 data row + 1 header row
    await expect
      .element(getByRole('row', { name: 'Ada' }))
      .not.toBeInTheDocument()
    await expect
      .element(getByRole('row', { name: 'Alan Turing 41' }))
      .toBeInTheDocument()
    await expect
      .element(getByRole('row', { name: 'Grace' }))
      .not.toBeInTheDocument()
    // TODO: decide what should happen when a search term is entered and a row is selected:
    //     - the selection should definitely persist if the selected row is still visible?
    //     - should the selection be cleared if the row is filtered out?
    //     - should the selection persist but be hidden if the selected row is filtered out?
    // await expect.element(getByText('Table selection: none')).toBeInTheDocument()
  })
})
