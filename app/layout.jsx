import './globals.css'

export const metadata = {
  title: 'Consolidated View'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
