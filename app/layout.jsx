export const dynamic = 'force-dynamic'

import { AuthProvider } from '@/components/auth/auth-provider.jsx'
import { Main } from '@/components/main/main.jsx'
import Notifications from '@/components/notification/Notifications'
import { clientAuthConfig } from '@/lib/auth.js'

import './globals.css'

export const metadata = {
  title: 'Consolidated View'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-screen">
      <body className="h-screen">
        <AuthProvider config={clientAuthConfig}>
          <Main>{children}</Main>
          <Notifications />
        </AuthProvider>
      </body>
    </html>
  )
}
