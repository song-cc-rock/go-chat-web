<template>
  <n-list-item :class="isCurrentUser ? 'box-right' : 'box-left'">
    <template #suffix v-if="isCurrentUser">
      <n-avatar
        class="chat-avatar"
        round
        size="medium"
        :src="msg.avatar"
      />
    </template>
    <template #prefix v-if="!isCurrentUser">
      <n-avatar
        class="chat-avatar"
        round
        size="medium"
        :src="msg.avatar"
      />
    </template>

    <!-- 消息内容区 -->
    <n-thing :class="isCurrentUser ? 'current-user-thing' : 'other-user-thing'">
      <!-- 当前用户消息：状态在左，消息在右 -->
      <template v-if="isCurrentUser">
        <chat-message-status 
          :status="msg.status" 
          :msg="msg" 
          position="left"
          @resend="handleResend" 
        />
        <chat-message-box 
          :msg="msg" 
          direction="right" 
          @download="handleDownload" 
        />
      </template>
      
      <!-- 其他用户消息：消息在左，状态在右 -->
      <template v-else>
        <chat-message-box 
          :msg="msg" 
          direction="left" 
          @download="handleDownload" 
        />
        <chat-message-status 
          :status="msg.status" 
          :msg="msg" 
          position="right"
          @resend="handleResend" 
        />
      </template>
    </n-thing>
  </n-list-item>
</template>

<script setup lang="ts">
import type { ConversationMsgResponse } from '@/models/conversation'
import ChatMessageBox from '@/components/chat/ChatMessageBox.vue'
import ChatMessageStatus from '@/components/chat/ChatMessageStatus.vue'

// 定义props
const props = defineProps<{
  msg: ConversationMsgResponse;
  currentUserId: string;
}>()

// 定义事件
const emit = defineEmits<{
  download: [msg: ConversationMsgResponse];
  resend: [msg: ConversationMsgResponse];
}>()

// 计算是否为当前用户
const isCurrentUser = computed(() => props.msg.send === props.currentUserId)

// 处理下载
const handleDownload = (msg: ConversationMsgResponse) => {
  emit('download', msg)
}

// 处理重发
const handleResend = (msg: ConversationMsgResponse) => {
  emit('resend', msg)
}
</script>

<style scoped>
.chat-avatar {
  /* 可以在这里添加头像的特定样式 */
}

/* 消息项布局样式可以根据需要调整 */
:deep(.box-left .n-list-item__prefix) {
  margin-right: 15px !important;
}

:deep(.box-right .n-list-item__suffix) {
  margin-left: 15px !important;
}

/* 当前用户消息对齐到右侧 */
:deep(.current-user-thing .n-thing-main__content) {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

/* 其他用户消息对齐到左侧 */
:deep(.other-user-thing .n-thing-main__content) {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
</style>