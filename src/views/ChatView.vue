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
      <chat-user-list :chat-user-list="conversations" />
    </template>
    <template #2>
      <chat-container />
    </template>
  </n-split>
</template>

<script setup lang="ts">
import { SearchOutlined as SearchIcon, PlusOutlined as PlusIcon} from '@vicons/antd'
import ChatUserList from '@/components/chat/ChatUserList.vue'
import ChatContainer from '@/components/ChatContainer.vue'
import { onMounted, ref } from 'vue'
import { getConversationList } from '@/api/conversation.ts'
import { getAuthUser } from '@/utils/auth.ts'
import type { ConversationResponse } from '@/models/conversation.ts'

const authUser = getAuthUser()
const conversations = ref<ConversationResponse[]>()

onMounted(async () => {
  conversations.value = await getConversationList(authUser.id)
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
</style>
