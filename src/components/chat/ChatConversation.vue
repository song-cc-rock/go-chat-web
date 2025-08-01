<template>
  <n-list v-for="(value, key) in conversationMap" :key="key" class="group-chat" :show-divider="false">
    <div class="last-time-tag"><n-tag size="small">{{ getLastConversationTime(key) }}</n-tag></div>
    <n-list-item v-for="msg in value" :key="msg.id" :class="msg.sender === 'BobDylan' ? 'box-right' : 'box-left'">
      <template #prefix v-if="msg.sender !== 'BobDylan'">
        <n-avatar
          class="chat-avatar"
          round
          size="medium"
          :src="msg.avatar"
        />
      </template>
      <template #suffix v-if="msg.sender === 'BobDylan'">
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
import type { Msg } from '@/models/msg.ts'
import type { ConversationResponse, ConversationMsgResponse } from '@/models/conversation.ts'
import { getConversationHis } from '@/api/conversation.ts'
import { onMounted, ref } from 'vue'

const props = defineProps<{
  conversation: ConversationResponse | undefined;
}>();
// key: 上一次对话时间分组, value: 对话内容集合
const conversationMap = ref<Map<Date, ConversationMsgResponse[]>>(new Map())

onMounted(async () => {
  // Get conversation his
  const conversationId = props.conversation?.id
  if (!conversationId) {
    return
  }
  const msgList = await getConversationHis(conversationId)
  conversationMap.value = getConversationMap(msgList)
  console.log(conversationMap.value);
  
})

const getConversationMap = (res: ConversationMsgResponse[]) => {
  const groupedMap = new Map<Date, ConversationMsgResponse[]>()
  
  if (!res || res.length === 0) {
    return groupedMap
  }
  
  // Sort messages by timestamp (oldest first)
  const sortedMessages = res.sort((a, b) => {
    const timeA = new Date(a.time)
    const timeB = new Date(b.time)
    return timeA.getTime() - timeB.getTime()
  })
  
  let currentGroupKey: Date | null = null
  let currentGroup: ConversationMsgResponse[] = []
  
  sortedMessages.forEach((message) => {
    const messageTime = new Date(message.time)
    
    if (currentGroupKey === null) {
      // First message, start a new group
      currentGroupKey = messageTime
      currentGroup = [message]
    } else {
      // Check if message is within 5 minutes of the current group
      const timeDiff = Math.abs(messageTime.getTime() - currentGroupKey.getTime())
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

const getLastConversationTime = (date: Date) => {
  const now = new Date()
  const messageDate = new Date(date)
  
  // Check if it's today
  if (messageDate.toDateString() === now.toDateString()) {
    return messageDate.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }
  
  // Check if it's yesterday
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (messageDate.toDateString() === yesterday.toDateString()) {
    return '昨天'
  }
  
  // Check if it's this year
  if (messageDate.getFullYear() === now.getFullYear()) {
    return messageDate.toLocaleDateString('zh-CN', { 
      month: '2-digit', 
      day: '2-digit' 
    })
  }
  
  // Different year
  return messageDate.toLocaleDateString('zh-CN', { 
    year: 'numeric',
    month: '2-digit', 
    day: '2-digit' 
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
