import type { LoginUser } from '@/models/register.ts'
import { rawClient } from '@/utils/require.ts'

export function login(user: LoginUser): Promise<string> {
  return rawClient.post('/login', user)
}
