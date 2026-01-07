import { AuthProvider } from '@/components/auth/auth-provider.jsx'
import { Login } from '@/components/auth/login.jsx'
import { Main } from '@/components/main/main'
import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-screen">
      <body className="h-screen">
        <AuthProvider>
          <Login />
          <Main>{children}</Main>
        </AuthProvider>
      </body>
    </html>
  )
}
