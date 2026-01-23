import { signIn } from '@/lib/auth'

export function GET() {
  return signIn('microsoft-entra-id')
}
