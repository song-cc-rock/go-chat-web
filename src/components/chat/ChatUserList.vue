<template>
  <n-list :hoverable="true" :clickable="true" :bordered="false">
    <n-list-item v-for="chatUser in props.chatUserList" :key="chatUser.id" @click="selectChatUser(chatUser)"
                 :class="currentChatUser != null && chatUser.id === currentChatUser.id ? 'current-chat-focus': ''">
      <template #prefix>
        <n-avatar
          class="chat-avatar"
          round
          size="medium"
          :src="chatUser.avatar"
        />
      </template>
      <n-thing :title="chatUser.nickName" :title-extra="formatLastTime(chatUser.lastMessageAt)">
        <span class="last-content">{{sentByTarget(chatUser) ? chatUser.nickName + ": " + chatUser.lastMessage : chatUser.lastMessage}}</span>
      </n-thing>
      <n-badge :value="chatUser.unreadCount" :max="99" class="un-read-badge" />
    </n-list-item>
  </n-list>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { ConversationResponse } from '@/models/conversation.ts'
import { formatTimestamp } from '@/utils/date.ts'
const props = defineProps<{
  chatUserList: ConversationResponse[] | undefined;
}>();

const currentChatUser = ref<ConversationResponse>()

const selectChatUser = (user: ConversationResponse) => {
  currentChatUser.value = user;
}

const formatLastTime = (timestamp: number) => {
  const now = new Date()
  const todayZero = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const current = Math.floor(todayZero.getTime() / 1000)
  if (timestamp < current) {
    return  formatTimestamp(timestamp, "YYYY-MM-DD")
  } else {
    return formatTimestamp(timestamp, "HH:mm")
  }
}

const sentByTarget = (user: ConversationResponse) => {
  return user.lastSentUser === user.targetUserID
}
</script>

<style scoped>
.n-list {
  --n-color-hover: #eee;
}

:deep(li.n-list-item) {
  padding: 8px 15px!important;
  --n-border-radius: 0px;
}

.last-content {
  font-size: 12px;
  font-weight: 400;
  color: rgb(179, 179, 179);
  font-style: normal;
}

:deep(.n-thing-main__content) {
  margin-top: 0 !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 90%;
}

:deep(.n-thing-header__extra) {
  color: rgb(185, 185, 185);
  font-size: 12px;
  font-weight: 400;
  font-style: normal;
}

:deep(.n-thing .n-thing-main .n-thing-header .n-thing-header__title) {
  font-size: 14px;
  font-weight: 500;
}

:deep(.n-thing .n-thing-main .n-thing-header) {
  margin-bottom: 2px;
}

:deep(.n-list-item__prefix) {
  margin-right: 12px!important;
}

.chat-avatar {
  display: flex;
}

.current-chat-focus {
  background-color: rgb(238, 238, 238);
}

.un-read-badge {
  float: right;
  position: relative;
  top: -20px;
  height: 0;
}

:deep(.un-read-badge sup.n-badge-sup) {
  font-size: 11px!important;
}
</style>
