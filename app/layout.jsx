import Footer from './components/Footer'
import './globals.css'

export const metadata = {
  title: 'Consolidated View'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="container mx-auto">
        {children}
        <Footer />
      </body>
    </html>
  )
}
