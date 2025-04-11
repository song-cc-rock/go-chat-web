import { rawClient } from '@/utils/require.ts'
import type { RegisterUser } from '@/models/register.ts'

export function sendVerifyCode(mail: string): Promise<string> {
  return rawClient.post('/send-code', {"mail": mail})
}

export function register(user: RegisterUser): Promise<string> {
  return rawClient.post('/register', user)
}
