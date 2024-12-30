<template>
  <n-list :hoverable="true" :clickable="true" :bordered="false">
    <n-list-item v-for="chatUser in chatUserList" :key="chatUser.id" @click="selectChatUser(chatUser)"
                 :class="currentChatUser != null && chatUser.id === currentChatUser.id ? 'current-chat-focus': ''">
      <template #prefix>
        <n-avatar
          class="chat-avatar"
          round
          size="medium"
          :src="chatUser.avatar"
        />
      </template>
      <n-thing :title="chatUser.name" :title-extra="chatUser.lastChatTime">
        <span class="last-content">{{chatUser.lastChatContent}}</span>
      </n-thing>
    </n-list-item>
  </n-list>
</template>

<script setup lang="ts">
import type { ChatUser } from '@/models/user'

const chatUserList: ChatUser[] = [
  {
    id: '321419841',
    name: 'BobDylan',
    avatar: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2F594048bb-3a81-4d16-95c0-d0d2f7e78af9%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1737874445&t=93b89b7698d017646d56dd8748736e3f',
    lastChatContent: '哪吒乐队: 他在时间门外。',
    lastChatTime: '11:38'
  },
  {
    id: '321419842',
    name: '寸铁演腰',
    avatar: 'https://img1.baidu.com/it/u=507077318,2244959797&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667',
    lastChatContent: '寸铁: 翻过小杰克遥远的新泽西。',
    lastChatTime: '10:31'
  },
  {
    id: '321419843',
    name: '痛仰',
    avatar: 'https://img1.baidu.com/it/u=3384405464,3680884287&fm=253&fmt=auto&app=138&f=PNG?w=502&h=500',
    lastChatContent: '万青: 电灯熄灭, 物换星移, 泥牛入海。',
    lastChatTime: '09:11'
  }
]

const currentChatUser = ref<ChatUser>()

function selectChatUser(user: ChatUser) {
  currentChatUser.value = user;
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
</style>
