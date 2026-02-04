export const dynamic = 'force-dynamic'

import { AuthProvider } from '@/components/auth/auth-provider.jsx'
import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary'
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
        <ErrorBoundary>
          <AuthProvider config={clientAuthConfig}>
            <Main>{children}</Main>
            <Notifications />
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
