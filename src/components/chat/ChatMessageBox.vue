<template>
  <!-- 文本消息 -->
  <div v-if="msg.type !== 'file'" class="chat-box" :class="[direction]">
    <p v-html="msg.content" />
  </div>
  <!-- 文件消息 -->
  <div v-else class="chat-box file-message" :class="[direction]">
    <div class="file-info">
      <n-icon size="20" class="file-icon">
        <component :is="getFileIcon(msg.fileInfo?.type || '')" />
      </n-icon>
      <div class="file-details">
        <div class="file-name">{{ msg.fileInfo?.name }}</div>
        <div class="file-size">{{ formatFileSize(msg.fileInfo?.size || 0) }}</div>
      </div>
      <n-button text size="tiny" class="file-download-btn" @click="downloadFile(msg)">
        <n-icon size="16"><component :is="DownloadIcon" /></n-icon>
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ConversationMsgResponse } from '@/models/conversation'
import { 
  FileOutlined, 
  FileTextOutlined, 
  FileImageOutlined, 
  VideoCameraOutlined, 
  AudioOutlined, 
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
  if (fileType.startsWith('image/')) return FileImageOutlined
  if (fileType.startsWith('video/')) return VideoCameraOutlined
  if (fileType.startsWith('audio/')) return AudioOutlined
  if (fileType.includes('text/') || fileType.endsWith('pdf')) return FileTextOutlined
  return FileOutlined
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

/* 文件消息样式 */
.file-message {
  max-width: 300px;
  min-width: 200px;
}

.file-info {
  display: flex;
  align-items: center;
  padding: 5px 0;
}

.file-icon {
  margin-right: 10px;
  color: #1890ff;
}

.file-details {
  flex: 1;
  min-width: 0;
}

.file-name {
  font-size: 13px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 2px;
}

.file-size {
  font-size: 11px;
  color: rgba(0, 0, 0, 0.5);
}

.file-download-btn {
  margin-left: 5px;
  padding: 0;
  min-width: auto;
}

.file-message:hover {
  background-color: #dcdcdc;
}
</style>