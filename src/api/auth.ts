import { rawClient } from '@/utils/require.ts'

export function getAuthUrl(authType: string): Promise<string> {
  return rawClient.post('/auth-url', {'authType': authType})
}
