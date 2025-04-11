import request from '@/utils/require.ts'
import type { RegisterUser } from '@/models/register.ts'

export function sendVerifyCode(mail: string): Promise<string> {
  return request.post('/send-verify-code', {"mail": mail})
}

export function register(user: RegisterUser): Promise<string> {
  return request.post('/register', user)
}
