import { render } from 'vitest-browser-react'

import {
  FullWidthSection,
  LeftSection,
  RightSection,
  Sections
} from '@/components/sections/sections'
import { expect, it } from 'vitest'

describe('Sections component tests', () => {
  it('renders the sections component with content', async () => {
    // render with coloured background to visually confirm section widths fill available space
    const { getByText } = await render(
      <Sections>
        <FullWidthSection>
          <div style={{ backgroundColor: 'lightblue' }}>Full Width Content</div>
        </FullWidthSection>
        <LeftSection>
          <div style={{ backgroundColor: 'lightblue' }}>Left Content</div>
        </LeftSection>
        <RightSection>
          <div style={{ backgroundColor: 'lightblue' }}>Right Content</div>
        </RightSection>
      </Sections>
    )

    await expect.element(getByText('Full Width Content')).toBeInTheDocument()
    await expect.element(getByText('Left Content')).toBeInTheDocument()
    await expect.element(getByText('Right Content')).toBeInTheDocument()
  })

  it('renders the sections component with screen reader titles', async () => {
    const { getByRole } = await render(
      <Sections srTitle="Page">
        <FullWidthSection srTitle="Full Width Section">
          Full Width Content
        </FullWidthSection>
        <LeftSection srTitle="Left Section">Left Content</LeftSection>
        <RightSection srTitle="Right Section">Right Content</RightSection>
      </Sections>
    )

    await expect
      .element(getByRole('heading', { name: 'Page' }))
      .toBeInTheDocument()
    await expect
      .element(getByRole('heading', { name: 'Full Width Section' }))
      .toBeInTheDocument()
    await expect
      .element(getByRole('heading', { name: 'Left Section' }))
      .toBeInTheDocument()
    await expect
      .element(getByRole('heading', { name: 'Right Section' }))
      .toBeInTheDocument()
  })

  it('does not render header if none are provided', async () => {
    const { getByRole } = await render(
      <Sections>
        <FullWidthSection>
          Full Width Content
        </FullWidthSection>
        <LeftSection >Left Content</LeftSection>
        <RightSection >Right Content</RightSection>
      </Sections>
    )

    await expect
      .element(getByRole('heading')).not.toBeInTheDocument()
  })
})
