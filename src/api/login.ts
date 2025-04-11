import type { LoginUser } from '@/models/register.ts'
import request from '@/utils/require.ts'

export function login(user: LoginUser): Promise<string> {
  return request.post('/login', user)
}
