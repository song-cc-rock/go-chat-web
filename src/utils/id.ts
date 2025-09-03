import { nanoid } from 'nanoid'

/**
 * 生成唯一的临时ID
 * 格式: tmp-时间戳-uuid
 * @returns 唯一的临时ID字符串
 */
export const generateTempId = (): string => {
  const timestamp = Date.now()
  const uuid = nanoid(8) // 生成8位的短UUID
  return `tmp-${timestamp}-${uuid}`
}