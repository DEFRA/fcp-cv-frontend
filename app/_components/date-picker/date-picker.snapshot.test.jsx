import { renderToString } from 'react-dom/server'
import { vi } from 'vitest'

import { DatePicker } from './date-picker'

describe('DatePicker snapshot', () => {
  const fixedDate = new Date('2021-11-15T12:00:00.000Z')

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(fixedDate)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('renders with default props', () => {
    const html = renderToString(
      <DatePicker value="2021-06-01" onChange={() => {}} />
    )

    expect(html).toMatchSnapshot()
  })

  test('renders with custom label', () => {
    const html = renderToString(
      <DatePicker value="2021-06-01" onChange={() => {}} label="Select date" />
    )

    expect(html).toMatchSnapshot()
  })

  test('renders with custom min date', () => {
    const html = renderToString(
      <DatePicker value="2021-06-01" onChange={() => {}} min="2020-01-01" />
    )

    expect(html).toMatchSnapshot()
  })

  test('renders with empty value', () => {
    const html = renderToString(<DatePicker value="" onChange={() => {}} />)

    expect(html).toMatchSnapshot()
  })

  test('renders with all custom props', () => {
    const html = renderToString(
      <DatePicker
        value="2021-08-15"
        onChange={() => {}}
        label="Birth Date"
        min="1900-01-01"
      />
    )

    expect(html).toMatchSnapshot()
  })
})
