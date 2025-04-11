<template>
  <div class="to-group">
    <span class="group-name-title">{{props.currentGroup.name}}</span>
  </div>
  <n-scrollbar style="max-height: 60%; display: flex; width: 97%; padding: 10px;" class="member-container">
    <div v-for="member in groupMemberList" :key="member.id" class="member-box">
      <n-avatar
        class="group-member-avatar"
        round
        :size="60"
        :src="member.avatar" />
      <span class="member-name">{{member.name}}</span>
    </div>
  </n-scrollbar>
  <div class="send-group-msg">
    <n-button strong secondary type="tertiary">
      发消息
    </n-button>
  </div>
</template>

<script setup lang="ts">
import type { ChatUser } from '@/models/user.ts'
import type { Group } from '@/models/group.ts'

const props = defineProps<{
  currentGroup: ChatUser | Group;
}>();

const groupMemberList: ChatUser[] = [
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
  },
  {
    id: '321419844',
    name: '华北浪革',
    avatar: 'https://img0.baidu.com/it/u=1843932659,299648558&fm=253&fmt=auto&app=138&f=JPEG?w=534&h=500',
    lastChatContent: '万青: 电灯熄灭, 物换星移, 泥牛入海。',
    lastChatTime: '09:11'
  },
  {
    id: '321419845',
    name: 'The Beatles',
    avatar: 'https://img1.baidu.com/it/u=2403823509,2761953595&fm=253&fmt=auto&app=138&f=JPEG?w=509&h=500',
    lastChatContent: '万青: 电灯熄灭, 物换星移, 泥牛入海。',
    lastChatTime: '09:11'
  },
  {
    id: '321419846',
    name: 'BobMarly',
    avatar: 'https://img0.baidu.com/it/u=2219683622,2784359474&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1117',
    lastChatContent: '万青: 电灯熄灭, 物换星移, 泥牛入海。',
    lastChatTime: '09:11'
  },
  {
    id: '321419847',
    name: '我爱南京',
    avatar: 'https://img2.baidu.com/it/u=3846891742,3153911709&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1067',
    lastChatContent: '万青: 电灯熄灭, 物换星移, 泥牛入海。',
    lastChatTime: '09:11'
  }
]
</script>

<style scoped>
.to-group {
  font-size: 20px;
  cursor: pointer;
  float: left;
  left: 10px;
  width: 100%;
  text-align: left;
  height: 10%;
  border-bottom: 1px solid whitesmoke;
}

.group-name-title {
  position: relative;
  top: 25px;
  left: 20px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.group-member-avatar {
  margin: 20px;
}

.member-box {
  display: grid;
  margin-left: 1.5px;
}

.n-scrollbar > .n-scrollbar-container > .n-scrollbar-content {
  box-sizing: border-box;
  min-width: 100%;
  display: flex;
  flex-wrap: wrap;
}

.member-name {
  font-size: 13px;
  color: grey;
  font-weight: 500;
  text-align: center;
  width: 66px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: 18px;
}
</style>

<style>
.member-container.n-scrollbar > .n-scrollbar-container > .n-scrollbar-content {
  box-sizing: border-box;
  min-width: 100%;
  display: flex;
  flex-wrap: wrap;
}

.member-container.n-scrollbar > .n-scrollbar-container {
  max-height: 100%;
}

.send-group-msg {
  text-align: center;
  --n-text-color: black;
}

.send-group-msg .n-button {
  --n-text-color: black!important;
  --n-text-color-hover: black!important;
  --n-text-color-pressed: black!important;
  --n-text-color-focus: black!important;
  width: 120px;
}
</style>
