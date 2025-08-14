<template>
  <div class="chat-container">
    <n-list v-for="[key, value] in Array.from(conversationMap.entries())" :key="key.getTime()" class="group-chat" :show-divider="false">
    <div class="last-time-tag"><n-tag size="small">{{ getLastConversationTime(key.getTime()) }}</n-tag></div>
    <n-list-item v-for="msg in value" :key="msg.id" :class="msg.send === authUser.id ? 'box-right' : 'box-left'">
      <template #suffix v-if="msg.send === authUser.id">
        <n-avatar
          class="chat-avatar"
          round
          size="medium"
          :src="msg.avatar"
        />
      </template>
      <template #prefix v-if="msg.send !== authUser.id">
        <n-avatar
          class="chat-avatar"
          round
          size="medium"
          :src="msg.avatar"
        />
      </template>
      <n-thing v-if="msg.send === authUser.id">
        <div class="status-wrap left">
          <n-icon v-if="msg.status === 'sent'" size="16" class="status-icon spin">
            <component :is="LoadingIcon" />
          </n-icon>
          <n-button v-else-if="msg.status === 'failed'" text size="tiny" class="status-icon resend-btn" @click="onResend(msg)">
            <n-icon size="16">
              <component :is="WarningIcon" />
            </n-icon>
          </n-button>
        </div>
        <div class="chat-box">
          <p v-html="msg.content" />
        </div>
      </n-thing>
      <n-thing v-if="msg.send !== authUser.id">
        <div class="chat-box">
          <p v-html="msg.content" />
        </div>
        <div class="status-wrap right">
          <n-icon v-if="msg.status === 'sent'" size="16" class="status-icon spin">
            <component :is="LoadingIcon" />
          </n-icon>
          <n-button v-else-if="msg.status === 'failed'" text size="tiny" class="status-icon resend-btn" @click="onResend(msg)">
            <n-icon size="16">
              <component :is="WarningIcon" />
            </n-icon>
          </n-button>
        </div>
      </n-thing>
    </n-list-item>
  </n-list>

  <!-- 滚动到底部按钮 -->
  <n-button
    v-if="showScrollToBottomBtn"
    class="scroll-to-bottom-btn"
    size="small"
    round
    @click="scrollToBottom"
    :disabled="scrollToBottomDisabled"
  >
    <n-icon size="16"><component :is="ScrollDownIcon" /></n-icon>
  </n-button>
  </div>
</template>

<script setup lang="ts">
import type { ConversationResponse, ConversationMsgResponse } from '@/models/conversation.ts'
import { getConversationHis } from '@/api/conversation.ts'
import { onMounted, ref, watch, inject, type Ref, onUnmounted } from 'vue'
import { getAuthUser } from '@/utils/auth.ts'
import WebSocketService from '@/utils/websocket.ts'
import { Loading3QuartersOutlined as LoadingIcon, ExclamationCircleOutlined as WarningIcon, ArrowDownOutlined as ScrollDownIcon } from '@vicons/antd'
import eventBus from '@/utils/eventBus.ts'

const props = defineProps<{
  conversation: ConversationResponse | undefined;
}>();
// key: 上一次对话时间分组, value: 对话内容集合
const conversationMap = ref<Map<Date, ConversationMsgResponse[]>>(new Map())
const authUser = getAuthUser()
// 注入WebSocket服务
const wsService = inject<Ref<WebSocketService | null>>('wsService', ref(null))

onMounted(async () => {
  // 监听新消息和消息状态变化
  if (wsService.value) {
    watch(
      () => wsService.value?.messages,
      (newMessages) => {
        if (newMessages && newMessages.length > 0) {
          // 分离状态更新消息和新消息
          const updatedMessages = newMessages.filter(msg => 
            msg.send === authUser.id && 
            (msg.status === 'success' || msg.status === 'failed')
          );

          // 处理所有新消息
          const relevantMessages = newMessages.filter(msg => 
            props.conversation && (
              msg.send === props.conversation.targetUserId || 
              msg.receiver === props.conversation.targetUserId
            )
          );

          // 先处理状态更新
          if (updatedMessages.length > 0) {
            updateConversationMap(updatedMessages);
          }

          // 再处理新消息
          if (relevantMessages.length > 0) {
            updateConversationMap(relevantMessages);
          }

          // 如果有任何消息被处理，滚动到底部
          if (updatedMessages.length > 0 || relevantMessages.length > 0) {
            scrollToBottom();
          }
        }
      },
      { deep: true }
    )
  }
})

// 当选中的会话发生变化时，重新加载历史消息并重置分组
watch(
  () => props.conversation?.id,
  async (newId) => {
    if (!newId) {
      conversationMap.value = new Map()
      return
    }
    const msgList = await getConversationHis(newId)
    eventBus.emit('refreshUnreadCount')
    conversationMap.value = getConversationMap(msgList)
    scrollToBottom()
  },
  { immediate: true }
)

// 更新对话映射
const updateConversationMap = (newMessages: ConversationMsgResponse[]) => {
  const currentMap = conversationMap.value
  newMessages.forEach((message) => {
    // 检查是否是更新现有消息的状态
    // 查找现有消息，优先匹配id，其次匹配clientTmpId或actualId
    // 优化匹配逻辑：优先匹配actualId，然后是clientTmpId，最后是id
    const existingEntry = Array.from(currentMap.entries()).find(([_, messages]) => {
      return messages.some(m => 
        (message.actualId && m.actualId === message.actualId) || 
        (message.clientTmpId && m.clientTmpId === message.clientTmpId) || 
        m.id === message.id
      );
    });

    if (existingEntry) {
      // 找到现有消息，更新其状态
      const [key, messages] = existingEntry;
      const index = messages.findIndex(m => m.id === message.id);
      if (index !== -1) {
        messages[index] = { ...messages[index], ...message };
      }
    } else {
      // 新消息，按时间分组添加
      // 将秒级时间戳转换为毫秒级再创建Date对象
      const messageTime = new Date(message.created_at);
      let added = false

      // 尝试添加到现有组
      currentMap.forEach((messages, key) => {
        const timeDiff = messageTime.getTime() - key.getTime();
        const fiveMinutes = 5 * 60 * 1000;

        if (timeDiff <= fiveMinutes) {
          messages.push(message);
          added = true;
        }
      })

      // 如果没有添加到现有组，创建新组
      if (!added) {
        currentMap.set(messageTime, [message]);
      }
    }
  })

  // 更新Map以触发重新渲染
  conversationMap.value = new Map(currentMap)
}

// 滚动到底部
// 控制滚动到底部按钮的显示
const showScrollToBottomBtn = ref(false)
const scrollToBottomDisabled = ref(false)

// 监听滚动事件
onMounted(() => {
  const scrollContainer = document.querySelector('.n-scrollbar-container')
  if (scrollContainer) {
    const handleScroll = () => {
      // 检查是否滚动到底部附近（100px内）
      const isNearBottom = scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight < 100
      showScrollToBottomBtn.value = !isNearBottom
    }

    // 初始检查
    handleScroll()

    // 添加滚动监听
    scrollContainer.addEventListener('scroll', handleScroll)

    // 组件卸载时移除监听
    onUnmounted(() => {
      scrollContainer.removeEventListener('scroll', handleScroll)
    })
  }
})

const scrollToBottom = () => {
  // 防止重复点击
  scrollToBottomDisabled.value = true
  setTimeout(() => {
    const scrollContainer = document.querySelector('.n-scrollbar-container')
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight
      // 滚动后隐藏按钮
      showScrollToBottomBtn.value = false
    }
    // 恢复按钮状态
    setTimeout(() => {
      scrollToBottomDisabled.value = false
    }, 500)
  }, 100)
}

const getConversationMap = (res: ConversationMsgResponse[]) => {
  const groupedMap = new Map<Date, ConversationMsgResponse[]>()

  if (!res || res.length === 0) {
    return groupedMap
  }

  let currentGroupKey: Date | null = null
  let currentGroup: ConversationMsgResponse[] = []

  res.forEach((message) => {
    // 将秒级时间戳转换为毫秒级再创建Date对象
    const messageTime = new Date(message.created_at * 1000)

    if (currentGroupKey === null) {
      // First message, start a new group
      currentGroupKey = messageTime
      currentGroup = [message]
    } else {
      // Check if message is within 5 minutes of the current group's start time
      // Since messages are sorted, messageTime is always >= currentGroupKey, so no Math.abs needed.
      const timeDiff = messageTime.getTime() - currentGroupKey.getTime()
      const fiveMinutes = 5 * 60 * 1000 // 5 minutes in milliseconds

      if (timeDiff <= fiveMinutes) {
        // Add to current group
        currentGroup.push(message)
      } else {
        // Save current group and start a new one
        groupedMap.set(currentGroupKey, [...currentGroup])
        currentGroupKey = messageTime
        currentGroup = [message]
      }
    }
  })

  // Don't forget to add the last group
  if (currentGroupKey && currentGroup.length > 0) {
    groupedMap.set(currentGroupKey, [...currentGroup])
  }

  return groupedMap
}

const getLastConversationTime = (time: number) => {
  // 创建Date对象（time是秒级时间戳）
  const date = new Date(time);
  
  const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();

  // 创建当天本地时间（0点0分0秒）
  let today = new Date();
  today = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  if (date.getTime() > today.getTime()) {
    // 当天对话
    return `${hour}:${minute}`;
  } else {
    const currentYear = new Date().getFullYear();
    const dateYear = date.getFullYear();
    const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    if (dateYear === currentYear) {
      // 当年对话
      return `${month}-${day} ${hour}:${minute}`;
    } else {
      // 非当年对话
      return `${date.getFullYear()}-${month}-${day} ${hour}:${minute}`;
    }
  }
}

const onResend = (msg: ConversationMsgResponse) => {
  if (!props.conversation || !wsService.value || !wsService.value.messages || !wsService.value.messages) return
  // reuse the same content to resend; create a new local message object
  const clientTmpId = `temp-${Date.now()}`
  const newMessage: ConversationMsgResponse = {
    id: clientTmpId,
    send: authUser.id,
    receiver: props.conversation.targetUserId,
    content: msg.content,
    created_at: Date.now(),
    avatar: authUser.avatar || '',
    status: 'sent',
    actualId: '',
    clientTmpId: clientTmpId
  }
  // local push
  wsService.value.messages.push(newMessage)
  // send
  wsService.value.sendMessage({
    ...newMessage,
    conversation_id: props.conversation.id,
  })
}
</script>

<style scoped>
.group-chat {
  padding-top: 10px;
  padding-right: 20px;
}

.chat-box {
  position: relative;
  display: inline-block;
  margin: 0 0 0.5em 0;
  padding: 7px 10px;
  min-width: 20px;
  max-width: 70%;
  color: black;
  font-size: 13px;
  font-weight: 400;
  background: whitesmoke;
  border-radius: 10px;
  min-height: 20.8px;
}

.status-wrap {
  display: inline;
  padding: 5px;
}

.status-wrap.right {
  position: absolute;
}

.status-wrap.left .status-icon.spin.n-icon{
  margin-right: 3px!important;
}

.status-wrap.right .status-icon.spin.n-icon{
  margin-left: 3px!important;
}

.status-icon {
    font-size: 14px!important;
    opacity: 0.7;
    transition: opacity 0.3s;
  }

  .status-icon:hover {
  opacity: 1;
}

.resend-btn {
  padding: 0;
  min-width: auto;
  height: auto;
  opacity: 0.7;
}

.resend-btn:hover {
  opacity: 1;
  background-color: transparent;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.spin {
  animation: spin 1s linear infinite;
}

.chat-box:before {
  content: "";
  position: absolute;
  top: 5px;
  border: 6px solid transparent;
}

.chat-box p {
  margin: 0;
  padding: 0;
}

.group-chat .n-list-item {
  padding: 0 0 10px 0;
  width: 100%;
  align-items: flex-start;
  min-height: 100%;
}

.box-left .chat-box{
  background-color: whitesmoke;
}

.box-left .chat-box:hover {
  background-color: #dcdcdc;
}

.box-left .chat-box:hover:before {
  border-right: 10px solid #dcdcdc;
}

.box-left .chat-box:before {
  border-right: 10px solid whitesmoke;
}

.box-left .chat-box:before {
  margin-left: -24px;
}

.box-right .chat-box {
  background-color: #07C16F;
}

.box-right .chat-box:hover {
  background-color: #18a058;
}

.box-right .chat-box:before {
  border-left: 10px solid #07C16F;
  left: 95%;
  margin-left: 0;
}

.box-right .chat-box:hover:before {
  border-left: 10px solid #18a058;
}

:deep(.box-right .n-thing-main__content) {
  display: flex;
  justify-content: flex-end;
}

:deep(.box-left .n-list-item__prefix) {
  margin-right: 15px !important;
}

:deep(.box-right .n-list-item__suffix) {
  margin-left: 15px!important;
}

.last-time-tag {
  text-align: center;
  margin-bottom: 10px;
}  

.status-icon {
  vertical-align: middle;
  color: rgba(0, 0, 0, 0.45);
}

.resend-btn {
  padding: 0;
  margin-left: 4px;
  color: rgba(0, 0, 0, 0.45);
}

.spin {
  display: inline-block;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.scroll-to-bottom-btn {
    position: absolute;
    bottom: 5px;
    left: 300px;
    text-align: center;
    z-index: 9999;
    border: none;
    background-color: transparent;
}
</style>
