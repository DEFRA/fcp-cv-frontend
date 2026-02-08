import { render } from 'vitest-browser-react'

import packageJson from '../../../package.json' assert { type: 'json' }

import Footer from './Footer'

describe('Footer component tests', () => {
  it('renders the footer with version number', async () => {
    const { getByText } = await render(<Footer />)
    const footerLabel = `v${packageJson.version}`

    await expect.element(getByText(footerLabel)).toBeInTheDocument()
  })
})
