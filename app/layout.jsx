import { Main } from './components/main.jsx'
import './globals.css'

export const metadata = {
  title: 'Consolidated View'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-screen">
      <body className="h-screen">
        <Main>{children}</Main>
      </body>
    </html>
  )
}
