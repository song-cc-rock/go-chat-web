import { request } from '@/utils/require.ts'
import type { UploadResponse } from '@/models/upload'

/**
 * 上传文件接口
 * @param file 要上传的文件
 * @returns Promise<UploadResponse>
 */
export const uploadFile = async (file: File, tmpId: string): Promise<UploadResponse> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('tmpId', tmpId)
  
  const response = await request.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    timeout: 30000
  })
  
  return response.data as UploadResponse
}