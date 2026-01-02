import { renderToString } from 'react-dom/server'

import {
  FullWidthSection,
  LeftSection,
  RightSection,
  Sections
} from '@/components/sections/sections'

describe('Page snapshot', () => {
  /**
   * Base grid
   */
  test('renders grid', () => {
    const html = renderToString(<Sections>Content</Sections>)

    expect(html).toMatchSnapshot()
  })

  test('renders grid with screen reader title', () => {
    const html = renderToString(<Sections srTitle="page">Content</Sections>)

    expect(html).toMatchSnapshot()
  })

  /**
   * Full width page
   * e.g. /authenticate
   */
  test('renders full width layout', () => {
    const html = renderToString(
      <Sections>
        <FullWidthSection>Full Width Content</FullWidthSection>
      </Sections>
    )

    expect(html).toMatchSnapshot()
  })

  test('renders full width layout with screen reader title', () => {
    const html = renderToString(
      <Sections srTitle="page">
        <FullWidthSection srTitle="full">Full Width Content</FullWidthSection>
      </Sections>
    )

    expect(html).toMatchSnapshot()
  })

  /**
   * Page with left and right columns
   * e.g. /linked-contacts
   */
  test('renders left and right columns', () => {
    const html = renderToString(
      <Sections>
        <LeftSection>Left Content</LeftSection>
        <RightSection>Right Content</RightSection>
      </Sections>
    )

    expect(html).toMatchSnapshot()
  })

  test('renders left and right columns with screen reader titles', () => {
    const html = renderToString(
      <Sections srTitle="page">
        <LeftSection srTitle="left">Left Content</LeftSection>
        <RightSection srTitle="right">Right Content</RightSection>
      </Sections>
    )

    expect(html).toMatchSnapshot()
  })

  /**
   * Page with full width top section, and left and right columns
   * e.g. /land-details
   */
  test('renders left and right columns', () => {
    const html = renderToString(
      <Sections>
        <FullWidthSection>Full Width Content</FullWidthSection>
        <LeftSection>Left Content</LeftSection>
        <RightSection>Right Content</RightSection>
      </Sections>
    )

    expect(html).toMatchSnapshot()
  })

  test('renders left and right columns with screen reader titles', () => {
    const html = renderToString(
      <Sections srTitle="page">
        <FullWidthSection srTitle="full">Full Width Content</FullWidthSection>
        <LeftSection srTitle="left">Left Content</LeftSection>
        <RightSection srTitle="right">Right Content</RightSection>
      </Sections>
    )

    expect(html).toMatchSnapshot()
  })
})
