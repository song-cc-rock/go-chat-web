import { request } from '@/utils/require.ts'

// 文件上传响应类型
export interface UploadResponse {
  url: string
  name: string
  size: number
  type: string
}

/**
 * 上传文件接口
 * @param file 要上传的文件
 * @returns Promise<UploadResponse>
 */
export const uploadFile = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData()
  formData.append('file', file)
  
  // 创建专门用于文件上传的请求实例
  const response = await request.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    timeout: 30000
  })
  
  return response as UploadResponse
}