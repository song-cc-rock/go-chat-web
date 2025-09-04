<template>
  <n-split direction="horizontal" :max="0.5" :min="0.3" :default-size="0.3">
    <template #1>
      <div class="search-input">
        <n-input placeholder="搜索">
          <template #prefix>
            <n-icon :component="SearchIcon" />
          </template>
        </n-input>
        <n-button type="tertiary" size="small" class="plus-btn">
          <template #icon>
            <n-icon><PlusIcon /></n-icon>
          </template>
        </n-button>
      </div>
      <chat-user-list 
        :chat-user-list="conversations"
        @select="selectedConversation = $event" />
    </template>
    <template #2>
      <chat-container v-if="selectedConversation" :conversation="selectedConversation" />
      <div class="chat-placeholder" v-else>
        <n-icon size="80" class="placeholder-icon">
          <WechatIcon />
        </n-icon>
        <div class="placeholder-subtitle">选择一个对话开始聊天✨</div>
      </div>
    </template>
  </n-split>
</template>

<script setup lang="ts">
import { SearchOutlined as SearchIcon, PlusOutlined as PlusIcon, WechatOutlined as WechatIcon} from '@vicons/antd'
import ChatUserList from '@/components/chat/ChatUserList.vue'
import ChatContainer from '@/components/ChatContainer.vue'
import { onMounted, ref, watch, inject, type Ref, onUnmounted } from 'vue'
import { getConversationList, clearConversationUnreadCount } from '@/api/conversation.ts'
import { getAuthUser } from '@/utils/auth.ts'
import type { ConversationResponse, ConversationMsgResponse } from '@/models/conversation.ts'
import WebSocketService from '@/utils/websocket.ts'
import eventBus from '@/utils/eventBus.ts'

const authUser = getAuthUser()
const conversations = ref<ConversationResponse[]>()
const selectedConversation = ref<ConversationResponse>()

// 注入WebSocket服务
const wsService = inject<Ref<WebSocketService | null>>('wsService', ref(null))

const reloadConversation = async () => {
  // 重新获取对话列表
  conversations.value = await getConversationList(authUser.id)
  // 触发刷新未读消息计数的事件
  eventBus.emit('refreshUnreadCount')
}

onMounted(async () => {
  // 初始化加载对话列表
  await reloadConversation();
  // 监听消息发送事件，刷新对话列表
  eventBus.on('messageSent', reloadConversation);

  // 监听消息的变化
  watch(
    () => wsService.value?.messages,
    async (newMessages) => {
      if (newMessages && newMessages.length > 0) {
        // 遍历所有新消息而不仅仅是最后一条
        newMessages.forEach(msg => {
          if (msg.send !== authUser.id && msg.type !== 'ack') {
            // 检查是否是当前激活对话的消息
            if (selectedConversation.value && msg.send === selectedConversation.value.targetUserId) {
              // 清空当前对话未读条数
              clearConversationUnreadCount(selectedConversation.value.id);
            }
            // 刷新对话列表
            reloadConversation();
          }
        });
      }
    },
    { deep: true }
  );
})

// 监听对话切换，进入对话时刷新列表
watch(
  () => selectedConversation.value?.id,
  (newId) => {
    if (newId) {
      reloadConversation();
    }
  }
)

onUnmounted(() => {
  // 移除消息发送事件监听器
  eventBus.off('messageSent', reloadConversation)
})
</script>

<style scoped>
.search-input {
  background-color: white;
  padding: 12px;
  border-bottom: 1px rgb(239, 239, 245) solid;
  display: flex;
}

:deep(.search-input .n-input) {
  --n-color: whitesmoke!important;
  height: 30px;
  width: 90%;
}

:deep(.n-split__resize-trigger) {
  width: 1px!important;
}

:deep(.plus-btn) {
  background-color: whitesmoke;
  height: 30px;
  width: 30px;
  margin-left: 12px;
}

.chat-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.6) 100%);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.placeholder-icon {
  color: #1aad19;
  margin-bottom: 20px;
  animation: pulse 2s ease-in-out infinite;
}

.placeholder-text {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.placeholder-subtitle {
  font-size: 14px;
  color: #666;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
}

.chat-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bbb;
  font-size: 18px;
  background: transparent;
}
</style>
