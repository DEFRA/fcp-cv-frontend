import { SignedInUser } from '@/components/auth/signed-in-user.jsx'
import packageJson from '../../../package.json' assert { type: 'json' }

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 py-6 text-sm text-gray-600 flex items-center gap-5 justify-end">
      <SignedInUser />
      <div>v{packageJson.version}</div>
    </footer>
  )
}
