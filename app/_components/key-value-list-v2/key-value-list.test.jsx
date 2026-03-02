import {
  KeyValueList,
  KeyValueListContent,
  KeyValueListItem,
  KeyValueListTitle
} from '@/components/key-value-list-v2/key-value-list'
import { render } from 'vitest-browser-react'

describe('KeyValueList component tests', () => {
  it('renders the KeyValueList without expandable children', async () => {
    const items = [{ dd: 'Description 1', dt: 'Title 1' }]

    const { getByText, getByRole } = await render(
      <KeyValueList>
        <KeyValueListTitle>Test Title</KeyValueListTitle>
        <KeyValueListContent>
          {items.map((item) => (
            <KeyValueListItem key={item.dt} {...item} />
          ))}
        </KeyValueListContent>
      </KeyValueList>
    )

    await expect.element(getByText('Test Title')).toBeInTheDocument()
    await expect.element(getByText('Title 1')).toBeInTheDocument()
    await expect.element(getByText('Description 1')).toBeInTheDocument()
  })

  it('renders the KeyValueList with expandable children', async () => {
    const items = [
      { dd: 'Description 1', dt: 'Title 1', children: 'Children 1' }
    ]

    const { getByText, getByRole } = await render(
      <KeyValueList>
        <KeyValueListTitle>Test Title</KeyValueListTitle>
        <KeyValueListContent>
          {items.map((item) => (
            <KeyValueListItem key={item.dt} {...item} />
          ))}
        </KeyValueListContent>
      </KeyValueList>
    )

    await expect.element(getByText('Test Title')).toBeInTheDocument()
    await expect.element(getByText('Title 1')).toBeInTheDocument()
    await expect.element(getByText('Description 1')).toBeInTheDocument()
    await expect.element(getByText('Children 1')).toBeInTheDocument()

    await getByRole('button', { expanded: false }).click()

    await expect
      .element(getByRole('button', { expanded: true }))
      .toBeInTheDocument()
  })
})
