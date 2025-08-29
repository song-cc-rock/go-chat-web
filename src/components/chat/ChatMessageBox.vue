<template>
  <!-- 文本消息 -->
  <div v-if="msg.type !== 'file'" class="chat-box" :class="[direction]">
    <p v-html="msg.content" />
  </div>
  <!-- 文件消息 -->
  <div v-else class="file-message-container" :class="[direction]">
    <div class="file-card" :class="getFileTypeClass(msg.fileInfo?.type || '')">
      <div class="file-icon-wrapper">
        <n-icon size="24" class="file-icon">
          <component :is="getFileIcon(msg.fileInfo?.type || '')" />
        </n-icon>
      </div>
      <div class="file-content">
        <div class="file-name" :title="msg.fileInfo?.name">{{ msg.fileInfo?.name }}</div>
        <div class="file-size">{{ formatFileSize(msg.fileInfo?.size || 0) }}</div>
      </div>
      <div class="file-actions">
        <n-button 
          text
          size="small" 
          class="download-btn" 
          @click="downloadFile(msg)"
        >
          <template #icon>
            <n-icon size="18">
              <component :is="DownloadIcon" />
            </n-icon>
          </template>
        </n-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ConversationMsgResponse } from '@/models/conversation'
import { 
  FileOutlined, 
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FilePptOutlined,
  FileZipOutlined,
  FileImageOutlined, 
  VideoCameraOutlined, 
  AudioOutlined,
  FileMarkdownOutlined,
  DownloadOutlined as DownloadIcon 
} from '@vicons/antd'

// 定义props和默认值
const props = withDefaults(defineProps<{
  msg: ConversationMsgResponse;
  direction?: 'left' | 'right';
}>(), {
  direction: 'left'
})

// 定义事件
const emit = defineEmits<{
  download: [msg: ConversationMsgResponse]
}>()

// 获取文件图标
const getFileIcon = (fileType: string) => {
  // 图片文件
  if (fileType.startsWith('image/')) return FileImageOutlined
  
  // 视频文件
  if (fileType.startsWith('video/')) return VideoCameraOutlined
  
  // 音频文件
  if (fileType.startsWith('audio/')) return AudioOutlined
  
  // PDF文件
  if (fileType === 'application/pdf' || fileType.endsWith('.pdf')) return FilePdfOutlined
  
  // Word文档
  if (fileType.includes('word') || fileType.includes('doc') || fileType.endsWith('.docx') || fileType.endsWith('.doc')) return FileWordOutlined
  
  // Excel表格
  if (fileType.includes('excel') || fileType.includes('sheet') || fileType.endsWith('.xlsx') || fileType.endsWith('.xls')) return FileExcelOutlined
  
  // PowerPoint演示文稿
  if (fileType.includes('powerpoint') || fileType.includes('presentation') || fileType.endsWith('.pptx') || fileType.endsWith('.ppt')) return FilePptOutlined
  
  // 压缩文件
  if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('7z') || fileType.endsWith('.zip') || fileType.endsWith('.rar') || fileType.endsWith('.7z')) return FileZipOutlined
  
  // Markdown文件
  if (fileType.endsWith('.md') || fileType.endsWith('.markdown')) return FileMarkdownOutlined
  
  // 文本文件
  if (fileType.startsWith('text/')) return FileMarkdownOutlined
  
  // 默认文件
  return FileOutlined
}

// 获取文件类型类名
const getFileTypeClass = (fileType: string) => {
  // 图片文件
  if (fileType.startsWith('image/')) return 'file-type-image'
  
  // 视频文件
  if (fileType.startsWith('video/')) return 'file-type-video'
  
  // 音频文件
  if (fileType.startsWith('audio/')) return 'file-type-audio'
  
  // PDF文件
  if (fileType === 'application/pdf' || fileType.endsWith('.pdf')) return 'file-type-pdf'
  
  // Office文档（Word, Excel, PowerPoint）
  if (fileType.includes('word') || fileType.includes('doc') || fileType.endsWith('.docx') || fileType.endsWith('.doc') ||
      fileType.includes('excel') || fileType.includes('sheet') || fileType.endsWith('.xlsx') || fileType.endsWith('.xls') ||
      fileType.includes('powerpoint') || fileType.includes('presentation') || fileType.endsWith('.pptx') || fileType.endsWith('.ppt')) {
    return 'file-type-office'
  }
  
  // 压缩文件
  if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('7z') || fileType.endsWith('.zip') || fileType.endsWith('.rar') || fileType.endsWith('.7z')) {
    return 'file-type-archive'
  }
  
  // 文本文件
  if (fileType.startsWith('text/') || fileType.endsWith('.md') || fileType.endsWith('.markdown')) {
    return 'file-type-text'
  }
  
  // 默认文件
  return 'file-type-default'
}

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 下载文件
const downloadFile = (msg: ConversationMsgResponse) => {
  // 触发父组件的下载事件
  emit('download', msg)
}
</script>

<style scoped>
.chat-box {
  position: relative;
  display: inline-block;
  margin: 0 0 0.5em 0;
  padding: 10px 12px;
  min-width: 20px;
  max-width: 70%;
  color: black;
  font-size: 13px;
  font-weight: 400;
  background: whitesmoke;
  border-radius: 10px;
  line-height: 1.0;
}

.chat-box:before {
  content: "";
  position: absolute;
  top: 5px;
  border: 6px solid transparent;
}

/* 左侧消息样式 */
.chat-box.left {
  background-color: whitesmoke;
}

.chat-box.left:hover {
  background-color: #dcdcdc;
}

.chat-box.left:before {
  border-right: 10px solid whitesmoke;
  margin-left: -24px;
}

.chat-box.left:hover:before {
  border-right: 10px solid #dcdcdc;
}

/* 右侧消息样式 */
.chat-box.right {
  background-color: #07C16F;
  color: white;
}

.chat-box.right .file-size {
  color: rgba(255, 255, 255, 0.7);
}

.chat-box.right:hover {
  background-color: #18a058;
}

.chat-box.right:before {
  border-left: 10px solid #07C16F;
  left: 95%;
  margin-left: 0;
}

.chat-box.right:hover:before {
  border-left: 10px solid #18a058;
}

.chat-box p {
  margin: 0;
  padding: 0;
}

/* emoji样式 */
:deep(.chat-box p .emoji-in-text) {
  font-size: 18px !important;
  vertical-align: middle !important;
  display: inline-block !important;
}

/* 文件消息现代化样式 */
.file-message-container {
  display: inline-block;
  width: 280px; /* 固定宽度 */
  margin: 4px 0;
}

.file-card {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
}

.file-card:hover {
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12);
  transform: translateY(-1px);
  background: #f1f5f9;
}

.file-icon-wrapper {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 14px;
  flex-shrink: 0;
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  position: relative;
  overflow: hidden;
}

/* 添加微妙的光泽效果 */
.file-icon-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.file-card:hover .file-icon-wrapper::before {
  left: 100%;
}

.file-icon {
  color: white;
  z-index: 1;
}

/* 根据文件类型设置不同的背景色 */
.file-type-image .file-icon-wrapper {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.file-type-video .file-icon-wrapper {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.file-type-audio .file-icon-wrapper {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.file-type-pdf .file-icon-wrapper {
  background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
}

.file-type-office .file-icon-wrapper {
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
}

.file-type-archive .file-icon-wrapper {
  background: linear-gradient(135deg, #f59e0b 0%, #eab308 100%);
}

.file-type-text .file-icon-wrapper {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.file-type-default .file-icon-wrapper {
  background: linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%);
}

.file-content {
  flex: 1;
  min-width: 0;
  margin-right: 12px;
}

.file-name {
  font-size: 14px;
  font-weight: 500;
  color: #24292f;
  line-height: 1.4;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 160px; /* 限制文件名宽度 */
}

.file-size {
  font-size: 12px;
  color: #656d76;
  font-weight: 400;
}

.file-actions {
  flex-shrink: 0;
}

.download-btn {
  background: transparent !important;
  border: none !important;
  color: #3b82f6;
  padding: 6px;
  transition: all 0.3s ease;
  border-radius: 6px;
}

.download-btn:hover {
  background: transparent !important;
  color: #2563eb;
  transform: scale(1.1);
  border: none !important;
}

.download-btn:active {
  transform: scale(1.05);
}

/* 右侧消息特殊样式 */
.file-message-container.right .file-card {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
}

.file-message-container.right .file-card:hover {
  background: #e2e8f0;
}

.file-message-container.right .download-btn {
  background: transparent !important;
  border: none !important;
  color: #3b82f6;
}

.file-message-container.right .download-btn:hover {
  background: transparent !important;
  border: none !important;
  color: #2563eb;
}
</style>