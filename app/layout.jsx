import Footer from './components/footer/Footer'
import './globals.css'

export const metadata = {
  title: 'Consolidated View'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="container mx-auto">
        <main id="main-content" role="main" className="min-h-screen py-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
