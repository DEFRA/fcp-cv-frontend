import { renderToString } from 'react-dom/server'
import Table from './Table'

function normalizeHtml(html) {
  return html.replaceAll('<!--$-->', '').replaceAll('<!--/$-->', '')
}

describe('Table snapshot', () => {
  it('matches the rendered structure', () => {
    const defaultData = [
      { firstName: 'Ada', lastName: 'Lovelace', age: 36 },
      { firstName: 'Grace', lastName: 'Hopper', age: 85 },
      { firstName: 'Alan', lastName: 'Turing', age: 41 }
    ]

    const defaultColumns = [
      {
        header: 'First name',
        accessorKey: 'firstName'
      },
      {
        header: 'Last name',
        accessorKey: 'lastName'
      },
      {
        header: 'Age',
        accessorKey: 'age'
      }
    ]

    const html = normalizeHtml(
      renderToString(
        <Table
          data={defaultData}
          columns={defaultColumns}
          enableSearching={false}
          enableSorting
        />
      )
    )

    expect(html).toMatchSnapshot()
  })

  it('matches the rendered structure with search enabled', () => {
    const defaultData = [
      { firstName: 'Ada', lastName: 'Lovelace', age: 36 },
      { firstName: 'Grace', lastName: 'Hopper', age: 85 },
      { firstName: 'Alan', lastName: 'Turing', age: 41 }
    ]

    const defaultColumns = [
      {
        header: 'First name',
        accessorKey: 'firstName'
      },
      {
        header: 'Last name',
        accessorKey: 'lastName'
      },
      {
        header: 'Age',
        accessorKey: 'age'
      }
    ]

    const html = normalizeHtml(
      renderToString(
        <Table
          data={defaultData}
          columns={defaultColumns}
          enableSearching
          enableSorting
        />
      )
    )

    expect(html).toMatchSnapshot()
  })

  it('matches the rendered structure with restricted sortable columns', () => {
    const defaultData = [
      { firstName: 'Ada', lastName: 'Lovelace', age: 36 },
      { firstName: 'Grace', lastName: 'Hopper', age: 85 },
      { firstName: 'Alan', lastName: 'Turing', age: 41 }
    ]

    const defaultColumns = [
      {
        header: 'First name',
        accessorKey: 'firstName'
      },
      {
        header: 'Last name',
        accessorKey: 'lastName'
      },
      {
        header: 'Age',
        accessorKey: 'age',
        enableSorting: false
      }
    ]

    const html = normalizeHtml(
      renderToString(
        <Table
          data={defaultData}
          columns={defaultColumns}
          enableSearching={false}
          enableSorting
        />
      )
    )

    expect(html).toMatchSnapshot()
  })

  it('matches the rendered structure with search enabled for all columns', () => {
    const defaultData = [
      { firstName: 'Ada', lastName: 'Lovelace', age: 36 },
      { firstName: 'Grace', lastName: 'Hopper', age: 85 },
      { firstName: 'Alan', lastName: 'Turing', age: 41 }
    ]

    const defaultColumns = [
      {
        header: 'First name',
        accessorKey: 'firstName'
      },
      {
        header: 'Last name',
        accessorKey: 'lastName'
      },
      {
        header: 'Age',
        accessorKey: 'age'
      }
    ]

    const html = normalizeHtml(
      renderToString(
        <Table
          data={defaultData}
          columns={defaultColumns}
          enableSearching
          enableSorting
        />
      )
    )

    expect(html).toMatchSnapshot()
  })

  it('applies default sorting when defaultSortColumn is provided', () => {
    const defaultData = [
      { firstName: 'Ada', lastName: 'Lovelace', age: 36 },
      { firstName: 'Grace', lastName: 'Hopper', age: 85 },
      { firstName: 'Alan', lastName: 'Turing', age: 41 }
    ]

    const defaultColumns = [
      {
        header: 'First name',
        accessorKey: 'firstName'
      },
      {
        header: 'Last name',
        accessorKey: 'lastName'
      },
      {
        header: 'Age',
        accessorKey: 'age'
      }
    ]

    const html = normalizeHtml(
      renderToString(
        <Table
          data={defaultData}
          columns={defaultColumns}
          enableSearching={false}
          enableSorting
          defaultSortColumn="age"
        />
      )
    )

    expect(html).toContain('aria-sort="ascending"')
  })

  it('does not render the Search UI when searching is disabled', () => {
    const defaultData = [{ firstName: 'Ada', lastName: 'Lovelace', age: 36 }]
    const defaultColumns = [
      { header: 'First name', accessorKey: 'firstName' },
      { header: 'Last name', accessorKey: 'lastName' },
      { header: 'Age', accessorKey: 'age' }
    ]

    const html = normalizeHtml(
      renderToString(
        <Table
          data={defaultData}
          columns={defaultColumns}
          enableSearching={false}
          enableSorting
        />
      )
    )

    expect(html).not.toContain('aria-label="Search"')
    expect(html).not.toContain('>Search<')
  })

  it('renders non-interactive headers when sorting is disabled', () => {
    const defaultData = [{ firstName: 'Ada', lastName: 'Lovelace', age: 36 }]
    const defaultColumns = [
      { header: 'First name', accessorKey: 'firstName' },
      { header: 'Last name', accessorKey: 'lastName' },
      { header: 'Age', accessorKey: 'age' }
    ]

    const html = normalizeHtml(
      renderToString(
        <Table
          data={defaultData}
          columns={defaultColumns}
          enableSearching={false}
          enableSorting={false}
        />
      )
    )

    expect(html).not.toContain('<button')
  })

  it('renders message when no results are available', () => {
    const html = normalizeHtml(
      renderToString(
        <Table
          data={[]}
          columns={[]}
          enableSearching={false}
          enableSorting={false}
        />
      )
    )

    expect(html).toContain('<table')
    expect(html).toContain('</table>')
    expect(html).toContain('No results found')
  })

  it('adds hover styling when rows are clickable', () => {
    const defaultData = [{ firstName: 'Ada', lastName: 'Lovelace', age: 36 }]
    const defaultColumns = [
      { header: 'First name', accessorKey: 'firstName' },
      { header: 'Last name', accessorKey: 'lastName' },
      { header: 'Age', accessorKey: 'age' }
    ]

    const html = normalizeHtml(
      renderToString(
        <Table
          data={defaultData}
          columns={defaultColumns}
          enableSearching={false}
          enableSorting
          onRowClick={() => {}}
        />
      )
    )

    expect(html).toContain('hover:bg-green-100/70')
    expect(html).toContain('cursor-pointer')
  })
})
