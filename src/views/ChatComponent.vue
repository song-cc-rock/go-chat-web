<template>
  <n-split direction="horizontal" :max="0.5" :min="0.3" :default-size="0.3">
    <template #1>
      <div class="search-input">
        <n-input placeholder="搜索">
          <template #prefix>
            <n-icon :component="SearchIcon" />
          </template>
        </n-input>
      </div>
      <chat-user-list />
    </template>
    <template #2>
      <chat-container />
    </template>
  </n-split>
</template>

<script setup lang="ts">
import { SearchOutlined as SearchIcon} from '@vicons/antd'
import ChatUserList from '@/components/chat/ChatUserList.vue'
import ChatContainer from '@/components/ChatContainer.vue'
</script>

<style scoped>
.search-input {
  background-color: white;
  padding: 12px;
  border-bottom: 1px rgb(239, 239, 245) solid;
}

:deep(.search-input .n-input) {
  --n-color: whitesmoke!important;
}

:deep(.n-split__resize-trigger) {
  width: 1px!important;
}
</style>
