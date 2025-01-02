<template>
  <!-- contact group -->
  <n-list :hoverable="true" :clickable="true" :bordered="false" :show-divider="false" class="contact-list">
    <div class="list-group-title">群组</div>
    <n-list-item v-for="contactGroup in contactGroupList" :key="contactGroup.id" @click="selectChatUser(contactGroup)"
                 :class="currentContact && contactGroup.id === currentContact.id ? 'current-contract-focus': ''">
      <template #prefix>
        <n-avatar
          class="contract-avatar"
          round
          size="medium"
          :src="contactGroup.avatar"
        />
      </template>
      <n-thing :title="contactGroup.name + '(' + contactGroup.memberCount + ')'"></n-thing>
    </n-list-item>
  </n-list>
  <n-divider />
  <!-- contact user -->
  <n-list :hoverable="true" :clickable="true" :bordered="false" :show-divider="false" class="contact-list">
    <div class="list-group-title">好友</div>
    <n-list-item v-for="contactUser in contactUserList" :key="contactUser.id" @click="selectChatUser(contactUser)"
                 :class="currentContact && contactUser.id === currentContact.id ? 'current-contract-focus': ''">
      <template #prefix>
        <n-avatar
          class="contract-avatar"
          round
          size="medium"
          :src="contactUser.avatar"
        />
      </template>
      <n-thing :title="contactUser.name">
        <span class="last-content">{{contactUser.email}}</span>
      </n-thing>
    </n-list-item>
  </n-list>
</template>

<script setup lang="ts">
import type {ContactUser } from '@/models/user'
import { ref } from 'vue';
import type { Group } from '@/models/group.ts'

const emit = defineEmits<{
    (e: 'setCurrent', user: ContactUser|Group): void;
  }>();

const contactUserList: ContactUser[] = [
  {
    id: '321419841',
    name: 'BobDylan',
    avatar: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2F594048bb-3a81-4d16-95c0-d0d2f7e78af9%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1737874445&t=93b89b7698d017646d56dd8748736e3f',
    email: 'folk@v.im',
    type: 'user',
    phone: '1701-24-3213'
  },
  {
    id: '321419842',
    name: '寸铁演腰',
    avatar: 'https://img1.baidu.com/it/u=507077318,2244959797&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667',
    email: 'rock@v.im',
    type: 'user',
    phone: '4535-44-9533'
  },
  {
    id: '321419843',
    name: '痛仰',
    avatar: 'https://img1.baidu.com/it/u=3384405464,3680884287&fm=253&fmt=auto&app=138&f=PNG?w=502&h=500',
    email: 'reggae@v.im',
    type: 'user',
    phone: '7564-42-9231'
  }
]

const contactGroupList: Group[] = [
  {
    id: '321419844',
    name: '迷笛之声',
    avatar: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fci.xiaohongshu.com%2F81df5dc2-3b6f-62c7-0fc4-f6d59a4c6977%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fci.xiaohongshu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1738389166&t=7085966a0aa5ad15b244af28fe18d8f4',
    memberCount: 7,
    type: 'group'
  },
  {
    id: '321419845',
    name: '摇滚新势力',
    avatar: 'https://img1.baidu.com/it/u=1412564125,2459020542&fm=253&fmt=auto&app=138&f=JPEG?w=270&h=380',
    memberCount: 13,
    type: 'group'
  }
]

const currentContact = ref<ContactUser|Group>()

function selectChatUser(user: ContactUser|Group) {
  currentContact.value = user;
  emit('setCurrent', user);
}
</script>

<style scoped>
.list-group-title {
  margin: 10px 15px;
  font-size: 14px;
}

.contact-list.n-list {
  --n-color-hover: white!important;
}

:deep(li.n-list-item) {
  padding: 8px 30px!important;
  --n-border-radius: 0px;
  margin: 0 5px;
}

:deep( .n-list-item:hover) {
  background-color: unset!important;
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

.contract-avatar {
  display: flex;
}

.current-contract-focus {
  box-shadow: 0 1px 6px 0 rgba(0, 0, 0, .1);
  border-radius: 10px !important;
}
</style>
