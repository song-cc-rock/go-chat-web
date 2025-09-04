import axios from 'axios'
import type { UploadResponse } from '@/models/upload'
import { createDiscreteApi } from 'naive-ui'

const { message } = createDiscreteApi(['message'])

const baseURL = process.env.NODE_ENV === 'production' ? '' : '/api'

// 创建专门用于处理blob下载的axios实例，不应用默认拦截器
const blobClient = axios.create({
  baseURL: baseURL + '/v1',
  timeout: 60000
})

// 添加请求拦截器处理授权token
blobClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 添加专门的响应拦截器处理文件下载
blobClient.interceptors.response.use(
  (response) => {
    // 对于blob类型响应，直接返回整个响应对象，不做任何处理
    return response
  },
  (error) => {
    message.error('请求失败: ' + error?.message || '未知错误')
    return Promise.reject(error)
  }
)

/**
 * 上传文件接口
 * @param file 要上传的文件
 * @param tmpId 临时ID
 * @returns Promise<UploadResponse>
 */
export const uploadFile = async (file: File, tmpId: string): Promise<UploadResponse> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('tmpId', tmpId)
  
  const response = await blobClient.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    timeout: 30000
  })
  
  // 对于上传请求，直接返回整个响应对象
  return response as unknown as UploadResponse
}

/**
 * 下载文件接口
 * @param fileId 文件ID
 * @returns Promise<void>
 */
export const downloadFileById = async (fileId: string): Promise<void> => {
  try {
    const response = await blobClient.get('/download?id=' + fileId, {
      responseType: 'blob',
      timeout: 60000 // 增加超时时间，适应大文件下载
    })
    
    // 从响应头里获取文件名
    const headers = response.headers as Record<string, string>
    const disposition = headers['content-disposition'] || headers['Content-Disposition']
    let fileName = 'download'

    if (disposition) {
      const match = disposition.match(/filename\*=UTF-8''([^;]+)|filename="([^"]+)"/i)
      if (match) {
        fileName = decodeURIComponent(match[1] || match[2])
      }
    }

    // 创建 blob 链接
    const blob = new Blob([response.data])
    const url = window.URL.createObjectURL(blob)

    // 创建隐藏的 <a> 标签下载
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    
    // 延迟清理，确保下载触发
    setTimeout(() => {
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      message.success('文件开始下载')
    }, 100)
  } catch (err) {
    message.error('文件下载失败: ' + (err as Error)?.message || '未知错误')
    throw err
  }
}