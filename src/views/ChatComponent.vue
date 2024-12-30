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
      这是右侧聊天框!!!
    </template>
  </n-split>
</template>

<script setup lang="ts">
import { SearchOutlined as SearchIcon} from '@vicons/antd'
import ChatUserList from '@/components/chat/ChatUserList.vue'
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
</style>
