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
            <n-icon><GroupAddIcon /></n-icon>
          </template>
        </n-button>
      </div>
      <contact-user-list />
    </template>
    <template #2>
    </template>
  </n-split>
</template>


<script setup lang="ts">
import ContactUserList from '@/components/contact/ContactUserList.vue'
import { SearchOutlined as SearchIcon, UsergroupAddOutlined as GroupAddIcon} from '@vicons/antd'
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
