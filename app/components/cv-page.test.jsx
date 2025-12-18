import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import {
  CVPage,
  CVPageFullWidth,
  CVPageLeftColumn,
  CVPageRightColumn
} from './cv-page.jsx'

describe('Footer snapshot', () => {
  it('matches the rendered structure', () => {
    const { container } = render(<CVPage />)

    expect(container).toHaveStyle({
      display: 'block'
    })
  })

  it('matches the rendered structure', () => {
    const { container } = render(
      <CVPage>
        <CVPageFullWidth />
      </CVPage>
    )

    expect(container).toHaveStyle({
      display: 'block'
    })
  })

  it('matches the rendered structure', () => {
    render(
      <CVPage>
        <CVPageFullWidth />
        <CVPageLeftColumn />
        <CVPageRightColumn />
      </CVPage>
    )

    screen.debug()

    expect(screen.getByTestId('list-detail-view')).toHaveStyle({
      display: 'grid'
    })
  })
})
