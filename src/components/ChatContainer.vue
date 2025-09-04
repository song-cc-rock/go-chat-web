<template>
  <div class="header">
    <div class="to-user">
      <span class="chat-name-title">{{ conversation?.nickName }}</span>
    </div>
    <n-button text>
      <n-icon size="30" :component="MoreIcon" class="more-btn" />
    </n-button>

  </div>
  <div class="content">
    <n-scrollbar style="max-height: 100%">
      <chat-conversation :conversation="conversation" />
    </n-scrollbar>
  </div>
  <div class="footer">
    <div class="chat-btn">
      <div class="left-btn">
        <n-popover
          content-class="emoji-popover"
          placement="top"
          trigger="click"
        >
          <template #trigger>
            <n-button text title="表情">
              <n-icon size="25" :component="EmojiIcon" />
            </n-button>
          </template>
          <div class="emoji-picker">
            <n-scrollbar style="max-height: 300px">
              <div class="emoji-category">
                <h4>常用表情</h4>
                <div class="emoji-grid">
                  <span v-for="emoji in emojiCategories.common" :key="emoji" class="emoji-item" @click="selectEmoji(emoji)">{{ emoji }}</span>
                </div>
              </div>
              <div class="emoji-category">
                <h4>所有表情</h4>
                <div class="emoji-grid">
                  <span v-for="emoji in emojiCategories.face" :key="emoji" class="emoji-item" @click="selectEmoji(emoji)">{{ emoji }}</span>
                </div>
              </div>
            </n-scrollbar>
          </div>
        </n-popover>
        <input
          ref="fileInput"
          type="file"
          style="display: none"
          @change="handleFileInputChange"
        />
        <n-button text @click="triggerFileInput" title="上传文件">
          <n-icon size="25" :component="FileIcon" />
        </n-button>
      </div>
      <div class="right-btn">
        <n-button text title="语音">
          <n-icon size="25" :component="CallPhoneIcon" />
        </n-button>
        <n-button text title="电话">
          <n-icon size="25" :component="CallVideoIcon" />
        </n-button>
      </div>
    </div>
    <n-input 
      type="textarea" 
      class="chat-area" 
      placeholder="" 
      v-model:value="messageContent"
      @keydown="handleKeyDown"
    />
    <n-button type="primary" class="send-btn" ghost @click="sendMessage">发送</n-button>
  </div>
</template>

<script setup lang="ts">
import { MoreHorizontal24Regular as MoreIcon, EmojiSparkle24Regular as EmojiIcon, DocumentAdd24Regular as FileIcon, History24Regular as ChatHisIcon,
  SlideMicrophone24Regular as CallPhoneIcon, Video24Regular as CallVideoIcon } from '@vicons/fluent'
import ChatConversation from '@/components/chat/ChatConversation.vue'
import type { ConversationResponse } from '@/models/conversation.ts'
import { ref, inject, type Ref } from 'vue'
import WebSocketService from '@/utils/websocket'
import { getAuthUser } from '@/utils/auth'
import { uploadFile } from '@/api/file'
import { generateTempId } from '@/utils/id'
import { useMessage } from 'naive-ui'

const props = defineProps<{
  conversation: ConversationResponse | undefined;
}>();
const authUser = getAuthUser()
const messageContent = ref('')
const showEmojiPicker = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const message = useMessage()
// inject ws service
const wsService = inject<Ref<WebSocketService | null>>('wsService', ref(null))

// 导入表情字典
import emojiDict from '@/utils/emojiDict'
// 导入事件总线
import eventBus from '@/utils/eventBus'

// 表情类别字典表
const emojiCategories = {
  // 初始化常用表情，会从localStorage加载
  common: [] as string[],
  face: emojiDict.face,
}

// 从localStorage加载常用表情
const loadCommonEmojis = () => {
  try {
    const saved = localStorage.getItem('commonEmojis')
    if (saved) {
      // 解析保存的表情使用记录 {emoji: count}
      const emojiCounts = JSON.parse(saved)
      // 按使用次数排序并取前20个
      const sortedEmojis = Object.entries(emojiCounts)
        .sort((a, b) => Number(b[1]) - Number(a[1]))
        .map(item => item[0])
        .slice(0, 5)
      emojiCategories.common = sortedEmojis
    } else {
      // 默认常用表情
      emojiCategories.common = emojiDict.commonDefault
    }
  } catch (error) {
    console.error('Failed to load common emojis:', error)
    // 出错时使用默认值
    emojiCategories.common = emojiDict.commonDefault
  }
}

// 更新常用表情使用频率并保存到localStorage
const updateCommonEmojis = (emoji: string) => {
  try {
    let emojiCounts: Record<string, number> = {}
    const saved = localStorage.getItem('commonEmojis')
    if (saved) {
      emojiCounts = JSON.parse(saved)
    }

    // 增加使用次数
    emojiCounts[emoji] = (emojiCounts[emoji] || 0) + 1

    // 保存到localStorage
    localStorage.setItem('commonEmojis', JSON.stringify(emojiCounts))

    // 更新常用表情列表
    const sortedEmojis = Object.entries(emojiCounts)
      .sort((a, b) => b[1] - a[1])
      .map(item => item[0])
      .slice(0, 20)
    emojiCategories.common = sortedEmojis
  } catch (error) {
    console.error('Failed to update common emojis:', error)
  }
}

// 初始化加载常用表情
loadCommonEmojis()

// 切换表情选择器显示/隐藏
const toggleEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value
}

// 选择表情
const selectEmoji = (emoji: string) => {
  // 直接添加emoji符号到输入框
  messageContent.value += emoji
  // 更新常用表情使用频率
  updateCommonEmojis(emoji)
}

// 点击其他地方关闭表情选择器
document.addEventListener('click', (e) => {
  const emojiPicker = document.querySelector('.emoji-picker')
  const emojiButton = document.querySelector('.left-btn n-button:nth-child(1)')
  if (emojiPicker && emojiButton && !emojiPicker.contains(e.target as Node) && !emojiButton.contains(e.target as Node)) {
    showEmojiPicker.value = false
  }
})

const sendMessage = () => {
  if (!messageContent.value.trim() || !props.conversation?.id || !wsService.value) {
    return
  }

  // 为消息中的emoji添加span标签和样式类
  const contentWithStyledEmojis = messageContent.value.replace(/([\uD800-\uDBFF][\uDC00-\uDFFF])/g, '<span class=\"emoji-in-text\">$1</span>')

  // Create message object
  const clientTmpId = generateTempId()
  const newMessage = {
    id: clientTmpId,
    send: authUser.id,
    receiver: props.conversation.targetUserId,
    content: contentWithStyledEmojis,
    created_at: Date.now(),
    avatar: authUser.avatar || '',
    status: 'sent',
    type: 'text',
    actualId: '',
    clientTmpId: clientTmpId,
    fileInfo: {
      name: '',
      size: 0,
      type: '',
      path: ''
    }
  }

  // send
  wsService.value.sendMessage({
    ...newMessage,
    conversation_id: props.conversation.id,
  })

  // local push
  if (wsService.value) {
    wsService.value.messages.push(newMessage)
  } else {
    console.error('Failed to push message: wsService is undefined')
  }

  messageContent.value = ''
  // 触发消息发送事件，通知外部组件刷新对话列表
  eventBus.emit('messageSent')
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
};

// 触发文件选择
const triggerFileInput = () => {
  fileInput.value?.click();
};

// 处理文件输入变化
const handleFileInputChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    fileUpload(input.files[0]);
    // 重置input值，允许重复选择同一文件
    input.value = '';
  }
};

const fileUpload = async (file: File) => {
  if (!props.conversation?.id || !wsService.value) {
    console.error('Cannot upload file: No conversation selected or wsService is unavailable');
    return;
  }

  // validate file size
  const maxSize = 100 * 1024 * 1024;
  if (file.size > maxSize) {
    message.error('文件大小不能超过100MB');
    return;
  }

  // 创建临时ID和文件消息对象
  const clientTmpId = generateTempId();
  
  // 初始化文件消息
  const fileMessage = {
    id: clientTmpId,
    send: authUser.id,
    receiver: props.conversation.targetUserId,
    content: `[文件] ${file.name} (${formatFileSize(file.size)})`,
    created_at: Date.now(),
    avatar: authUser.avatar || '',
    status: 'sent',
    actualId: '',
    clientTmpId: clientTmpId,
    fileInfo: {
      name: file.name,
      size: file.size,
      type: file.type,
      path: '',
      id: ''
    },
    type: 'file',
  };

  // 发送
  wsService.value.sendMessage({
    ...fileMessage,
    conversation_id: props.conversation.id,
  })

  // 本地推送
  if (wsService.value) {
    wsService.value.messages.push(fileMessage)
  } else {
    console.error('Failed to push message: wsService is undefined')
  }

  try {
    // 上传文件到服务器
    const uploadResponse = await uploadFile(file, clientTmpId);
    // 使用响应式方式更新文件ID
    if (wsService.value) {
    // 找到对应的消息并更新
      const index = wsService.value.messages.findIndex(msg => msg.clientTmpId === clientTmpId);
      if (index !== -1) {
        // 创建新对象以触发Vue的响应式更新
        const updatedMessage = {
          ...wsService.value.messages[index],
          fileInfo: {
            ...wsService.value.messages[index].fileInfo,
            id: uploadResponse.id
          }
        };
        
        // 使用splice替换整个消息对象，确保触发响应式更新
        wsService.value.messages.splice(index, 1, updatedMessage);
      }
    }
    message.success('文件上传成功');
    eventBus.emit('messageSent')
  } catch (error) {
    console.error('File upload failed:', error);
    message.error('文件上传失败，请重试');
  }
};

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
</script>

<style scoped>
.header, .footer {
  flex: none;
  background-color: white;
  text-align: center;
  line-height: 50px;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header {
  display: flex;
  height: 8.8%;
  border-bottom: 1px whitesmoke solid;
}

.footer {
  top: auto;
  bottom: 0;
  height: 31.2%;
  border-top: 1px whitesmoke solid;
}

.content {
  flex: 1;
  overflow-y: auto;
  height: 60%;
  padding: 0 0 0 20px;
}

.to-user {
  font-size: 16px;
  cursor: pointer;
  float: left;
  left: 10px;
  width: 90%;
  text-align: left;
  height: 100%;
}

.chat-name-title {
  position: relative;
  top: 8px;
  left: 20px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.more-btn {
  position: relative;
  left: 17px;
  top: 4px;
}

.chat-btn {
  display: flex;
  height: 17%;
  justify-content: space-between;
  padding-left: 15px;
  padding-top: 10px;
}

.left-btn {
  width: 60%;
  flex: 1;
  float: left;
  text-align: left;
}

.left-btn button,
.left-btn .n-button {
  margin-right: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 8px;
  padding: 8px;
  position: relative;
}

.upload-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.emoji-popover .emoji-picker {
  position: relative !important;
  bottom: auto !important;
  left: auto !important;
  width: 400px;
  background-color: white !important;
  padding: 10px!important;
  z-index: 1000 !important;
  -ms-overflow-style: none !important;
  scrollbar-width: none !important;
}

/* 隐藏滚动条 */
.emoji-popover .n-scrollbar {
  -ms-overflow-style: none !important;
  scrollbar-width: none !important;
}

.emoji-popover .n-scrollbar::-webkit-scrollbar {
  display: none !important;
}

.emoji-category {
  margin-bottom: 10px;
}

.emoji-category h4 {
    font-size: 13px;
    color: rgb(51, 54, 57);
    margin-bottom: 10px;
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(32px, 1fr));
  gap: 5px;
}

.emoji-item {
  font-size: 20px;
  text-align: center;
  padding: 5px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.2s;
}

.emoji-item:hover {
  background-color: #f0f0f0;
}

.left-btn button:hover {
  transform: translateY(-2px) scale(1.05);
}

.left-btn button:active {
  transform: translateY(0) scale(1.02);
  transition: all 0.1s ease;
}

.right-btn button {
  margin-right: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 8px;
  padding: 8px;
}

.right-btn button:hover {
  transform: translateY(-2px) scale(1.05);
}

.right-btn button:active {
  transform: translateY(0) scale(1.02);
  transition: all 0.1s ease;
}

.chat-area {
  height: 56%;
  text-align: start;
  --n-border: none!important;
  --n-border-hover: none!important;
  --n-border-focus: none!important;
  --n-box-shadow-focus: none!important;
  padding-left: 5px;
  font-size: 14px !important;
}

/* 为聊天输入框中的emoji添加样式 */
.chat-area ::v-deep span.emoji-in-text,
.chat-area emoji {
  font-size: 18px !important;
  vertical-align: middle;
}

.send-btn {
  height: 15%;
  float: inline-end;
  right: 24px;
  bottom: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 8px;
}

.send-btn:hover {
  transform: translateY(-2px) scale(1.05);
}

.send-btn:active {
  transform: translateY(0) scale(0.98);
  transition: all 0.1s ease;
}

:deep(.n-input.n-input--textarea.n-input--resizable .n-input-wrapper) {
  resize: none;
}

.btn-tips {
  height: 30px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

<style>
.n-popover.n-popover-shared.n-popover-shared--show-arrow {
    border-radius: 10px;
}

.emoji-in-text,
.emoji-item {
  font-size: 20px !important;
  vertical-align: middle;
  line-height: 0.9;
}
</style>
