import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'

import { LinkedContactsList } from './linked-contacts-list'

describe('LinkedContactsPage tests', () => {
  beforeAll(() => {
    vi.mock('next/navigation', () => ({
      useSearchParams: () => new URLSearchParams()
    }))
    vi.mock('@/hooks/data', () => ({
      useDal: () => ({
        data: [
          {
            crn: 'crn1',
            firstName: 'firstName1',
            lastName: 'lastName1',
            role: 'role1'
          },
          {
            crn: 'crn2',
            firstName: 'firstName2',
            lastName: 'lastName2',
            role: 'role2'
          }
        ]
      }),
      useDataverse: () => ({ data: [] })
    }))
  })

  it('renders the list table', async () => {
    const { getByText } = await render(<LinkedContactsList />)
    await expect.element(getByText('firstName1')).toBeInTheDocument()
  })

  it('clicking a row, adds crn to search params', async () => {
    const { getByRole } = await render(<LinkedContactsList />)

    await getByRole('row', { name: 'firstName1' }).click()
    expect(new URLSearchParams(window.location.search).get('crn')).toBe('crn1')
  })

  it('clicking clear resets the table', async () => {
    const { getByPlaceholder, getByText, getByRole } = await render(
      <LinkedContactsList />
    )
    await expect.element(getByText('firstName2')).toBeInTheDocument()

    await userEvent.type(getByPlaceholder('Enter search term'), '1')

    await expect.element(getByText('firstName2')).not.toBeInTheDocument()

    await getByRole('button', { name: 'Clear search' }).click()

    await expect.element(getByText('firstName2')).toBeInTheDocument()
  })
})
