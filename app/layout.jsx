import { Main } from '@/components/main/main'
import Notifications from '@/components/notification/Notifications'
import './globals.css'

export const metadata = {
  title: 'Consolidated View'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-screen">
      <body className="h-screen">
        <Notifications />
        <Main>{children}</Main>
      </body>
    </html>
  )
}
