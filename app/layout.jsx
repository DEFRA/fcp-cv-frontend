import { AuthProvider } from '@/components/auth/auth.jsx'
import { Main } from '@/components/main/main'
import './globals.css'

export const metadata = {
  title: 'Consolidated View'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-screen">
      <body className="h-screen">
        <AuthProvider>
          <Main>{children}</Main>
        </AuthProvider>
      </body>
    </html>
  )
}
