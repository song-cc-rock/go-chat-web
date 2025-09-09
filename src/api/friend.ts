import { request } from '@/utils/require.ts'
import type { FriendRequest } from '@/models/friend.ts'

export function getApplies(): Promise<FriendRequest[]> {
  return request.get('/applies')
}