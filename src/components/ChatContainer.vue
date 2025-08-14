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
        <n-button text>
          <n-icon size="25" :component="EmojiIcon" />
        </n-button>
        <n-button text>
          <n-icon size="25" :component="FileIcon" />
        </n-button>
        <n-button text>
          <n-icon size="25" :component="ChatHisIcon" />
        </n-button>
      </div>
      <div class="right-btn">
        <n-button text>
          <n-icon size="25" :component="CallPhoneIcon" />
        </n-button>
        <n-button text>
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
import WebSocketService from '@/utils/websocket.ts'
import { getAuthUser } from '@/utils/auth.ts'

const props = defineProps<{
  conversation: ConversationResponse | undefined;
}>();
const authUser = getAuthUser()
const messageContent = ref('')
// inject ws service
const wsService = inject<Ref<WebSocketService | null>>('wsService', ref(null))

const sendMessage = () => {
  if (!messageContent.value.trim() || !props.conversation?.id || !wsService.value) {
    return
  }

  // Create message object
  const clientTmpId = `temp-${Date.now()}`
  const newMessage = {
    id: clientTmpId,
    send: authUser.id,
    receiver: props.conversation.targetUserId,
    content: messageContent.value,
    created_at: Date.now(),
    avatar: authUser.avatar || '',
    status: 'sent',
    actualId: '',
    clientTmpId: clientTmpId
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
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
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

.left-btn button {
  margin-right: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 8px;
  padding: 8px;
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
</style>
