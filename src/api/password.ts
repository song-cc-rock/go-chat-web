import { rawClient } from '@/utils/require.ts'
import type { ResetPasswordUser } from '@/models/password.ts'

// 更新密码
export const resetPassword = (user: ResetPasswordUser) => {
  return rawClient.post('/update/pwd', user)
}