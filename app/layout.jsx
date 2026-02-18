export const dynamic = 'force-dynamic'

import { AuthProvider } from '@/components/auth/auth-provider'
import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary'
import { IframeMessenger } from '@/components/iframe-messenger/IframeMessenger'
import { Main } from '@/components/main/main'
import Notifications from '@/components/notification/Notifications'
import { config } from '@/config'
import { clientAuthConfig } from '@/lib/auth'
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
            <IframeMessenger
              crmOrigin={config.get('iframeMessenger.crmOrigin')}
            />
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
