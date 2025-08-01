<template>
  <n-list v-for="[key, value] in Array.from(conversationMap.entries())" :key="key.getTime()" class="group-chat" :show-divider="false">
    <div class="last-time-tag"><n-tag size="small">{{ getLastConversationTime(key.getTime()) }}</n-tag></div>
    <n-list-item v-for="msg in value" :key="msg.id" :class="msg.send === authUser.nickName ? 'box-left' : 'box-right'">
      <template #prefix v-if="msg.send === authUser.nickName">
        <n-avatar
          class="chat-avatar"
          round
          size="medium"
          :src="msg.avatar"
        />
      </template>
      <template #suffix v-if="msg.send !== authUser.nickName">
        <n-avatar
          class="chat-avatar"
          round
          size="medium"
          :src="msg.avatar"
        />
      </template>
      <n-thing>
        <div class="chat-box">
          <p v-html="msg.content" />
        </div>
      </n-thing>
    </n-list-item>
  </n-list>
</template>

<script setup lang="ts">
import type { ConversationResponse, ConversationMsgResponse } from '@/models/conversation.ts'
import { getConversationHis } from '@/api/conversation.ts'
import { onMounted, ref, watch, inject, type Ref } from 'vue'
import { getAuthUser } from '@/utils/auth.ts'
import WebSocketService from '@/utils/websocket.ts'

const props = defineProps<{
  conversation: ConversationResponse | undefined;
}>();
// key: 上一次对话时间分组, value: 对话内容集合
const conversationMap = ref<Map<Date, ConversationMsgResponse[]>>(new Map())
const authUser = getAuthUser()
// 注入WebSocket服务
const wsService = inject<Ref<WebSocketService | null>>('wsService', ref(null))

onMounted(async () => {
  // 监听新消息
  if (wsService.value) {
    watch(
      () => wsService.value?.messages.value,
      (newMessages) => {
        if (newMessages && newMessages.length > 0) {
          const lastMessage = newMessages[newMessages.length - 1]
          // 检查消息是否属于当前对话
          if (lastMessage && props.conversation && 
              (lastMessage.send === props.conversation.targetUserId || 
               lastMessage.receiver === props.conversation.targetUserId)) {
            updateConversationMap([lastMessage])
            scrollToBottom()
          }
        }
      },
      { deep: true }
    )
  }

  // 获取历史消息
  const conversationId = props.conversation?.id
  if (!conversationId) {
    return
  }
  const msgList = await getConversationHis(conversationId)
  conversationMap.value = getConversationMap(msgList)
  scrollToBottom()
})

// 更新对话映射
const updateConversationMap = (newMessages: ConversationMsgResponse[]) => {
  const currentMap = conversationMap.value
  newMessages.forEach((message) => {
    const messageTime = new Date(message.created_at)
    let added = false

    // 尝试添加到现有组
    currentMap.forEach((messages, key) => {
      const timeDiff = messageTime.getTime() - key.getTime()
      const fiveMinutes = 5 * 60 * 1000 // 5分钟

      if (timeDiff <= fiveMinutes) {
        messages.push(message)
        added = true
      }
    })

    // 如果没有添加到现有组，创建新组
    if (!added) {
      currentMap.set(messageTime, [message])
    }
  })

  // 更新Map以触发重新渲染
  conversationMap.value = new Map(currentMap)
}

// 滚动到底部
const scrollToBottom = () => {
  setTimeout(() => {
    const scrollContainer = document.querySelector('.n-scrollbar-container')
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight
    }
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
    const messageTime = new Date(message.created_at)

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
  const date = new Date(time * 1000);
  const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  let today = new Date();
  today.setHours(0, 0, 0, 0);
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
  left: 98%;
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
</style>
