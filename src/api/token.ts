import { request } from '@/utils/require.ts'

export function testToken(): Promise<string> {
  return request.post('/test-token')
}
