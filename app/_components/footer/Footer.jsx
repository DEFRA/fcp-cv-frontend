import packageJson from '../../../package.json' assert { type: 'json' }

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 py-6 text-right text-sm text-gray-600">
      <span>v{packageJson.version}</span>
    </footer>
  )
}
