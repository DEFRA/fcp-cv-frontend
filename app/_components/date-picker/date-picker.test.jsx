import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'

import { DatePicker } from './date-picker'

describe('DatePicker', () => {
  const validDate = '2021-11-15'
  const laterValidDate = '2022-06-01'

  it('renders with default label and displays the provided value', async () => {
    const { getByLabelText } = await render(
      <DatePicker value={validDate} onChange={() => {}} />
    )

    await expect.element(getByLabelText('Date')).toBeInTheDocument()
    await expect.element(getByLabelText('Date')).toHaveValue(validDate)
  })

  it('accepts a custom label', async () => {
    const { getByLabelText } = await render(
      <DatePicker value={validDate} onChange={() => {}} label="Select date" />
    )

    await expect.element(getByLabelText('Select date')).toBeInTheDocument()
  })

  it('has correct default min and max attributes', async () => {
    const today = new Date().toISOString().split('T')[0]
    const { getByLabelText } = await render(
      <DatePicker value={validDate} onChange={() => {}} />
    )

    await expect
      .element(getByLabelText('Date'))
      .toHaveAttribute('min', '2015-01-01')
    await expect.element(getByLabelText('Date')).toHaveAttribute('max', today)
  })

  it('does not call onChange while typing before committing', async () => {
    const onChange = vi.fn()
    const { getByLabelText } = await render(
      <DatePicker value={validDate} onChange={onChange} />
    )

    await userEvent.fill(getByLabelText('Date'), laterValidDate)

    expect(onChange).not.toHaveBeenCalled()
  })

  it('calls onChange with the valid date on blur', async () => {
    const onChange = vi.fn()
    const { getByLabelText, getByRole } = await render(
      <div>
        <DatePicker value={validDate} onChange={onChange} />
        <button type="button">elsewhere</button>
      </div>
    )

    await userEvent.fill(getByLabelText('Date'), laterValidDate)
    await getByRole('button', { name: 'elsewhere' }).click()

    expect(onChange).toHaveBeenCalledExactlyOnceWith(laterValidDate)
  })

  it('calls onChange with the valid date on Enter', async () => {
    const onChange = vi.fn()
    const { getByLabelText } = await render(
      <DatePicker value={validDate} onChange={onChange} />
    )

    await userEvent.fill(getByLabelText('Date'), laterValidDate)
    await userEvent.keyboard('{Enter}')

    expect(onChange).toHaveBeenCalledExactlyOnceWith(laterValidDate)
  })

  it('does not call onChange for dates outside the valid range', async () => {
    const onChange = vi.fn()
    const { getByLabelText } = await render(
      <DatePicker value={validDate} onChange={onChange} />
    )

    await userEvent.fill(getByLabelText('Date'), '2014-12-31')
    await userEvent.keyboard('{Enter}')
    expect(onChange).not.toHaveBeenCalled()

    await userEvent.fill(getByLabelText('Date'), '2099-01-01')
    await userEvent.keyboard('{Enter}')
    expect(onChange).not.toHaveBeenCalled()
  })

  it('does not call onChange when the input is empty on blur', async () => {
    const onChange = vi.fn()
    const { getByLabelText, getByRole } = await render(
      <div>
        <DatePicker value={validDate} onChange={onChange} />
        <button type="button">elsewhere</button>
      </div>
    )

    await userEvent.clear(getByLabelText('Date'))
    await getByRole('button', { name: 'elsewhere' }).click()

    expect(onChange).not.toHaveBeenCalled()
  })

  it('reverts to the original value after an invalid date is committed', async () => {
    const onChange = vi.fn()
    const { getByLabelText, getByRole } = await render(
      <div>
        <DatePicker value={validDate} onChange={onChange} />
        <button type="button">elsewhere</button>
      </div>
    )

    await userEvent.fill(getByLabelText('Date'), '2014-01-01')
    await getByRole('button', { name: 'elsewhere' }).click()

    await expect.element(getByLabelText('Date')).toHaveValue(validDate)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('does not call onChange when a non-Enter key is pressed', async () => {
    const onChange = vi.fn()
    const { getByLabelText } = await render(
      <DatePicker value={validDate} onChange={onChange} />
    )

    await userEvent.fill(getByLabelText('Date'), laterValidDate)
    await userEvent.keyboard('{Escape}')

    expect(onChange).not.toHaveBeenCalled()
  })

  it('accepts a custom min date and rejects dates below it', async () => {
    const onChange = vi.fn()
    const { getByLabelText } = await render(
      <DatePicker value={validDate} onChange={onChange} min="2020-01-01" />
    )

    await expect
      .element(getByLabelText('Date'))
      .toHaveAttribute('min', '2020-01-01')

    await userEvent.fill(getByLabelText('Date'), '2019-12-31')
    await userEvent.keyboard('{Enter}')

    expect(onChange).not.toHaveBeenCalled()
  })
})
