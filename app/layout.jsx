import { AuthProvider } from '@/components/auth/auth-provider.jsx'
import { Main } from '@/components/main/main.jsx'
import Notifications from '@/components/notification/Notifications'
import './globals.css'

const authConfig = {
  authority: process.env.AUTH_AUTHORITY,
  clientId: process.env.AUTH_CLIENT_ID,
  redirectUri: process.env.AUTH_REDIRECT_URI
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-screen">
      <body className="h-screen">
        <AuthProvider config={authConfig}>
          <Main>{children}</Main>
          <Notifications />
        </AuthProvider>
        <Main>{children}</Main>
      </body>
    </html>
  )
}
