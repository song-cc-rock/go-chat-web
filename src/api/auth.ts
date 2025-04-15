import { rawClient } from '@/utils/require.ts'

export function getAuthUrl(): Promise<string> {
  return rawClient.get('/github/auth-url')
}
