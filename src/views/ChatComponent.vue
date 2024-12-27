<script setup lang="ts">

import ChatUserList from '@/components/chat/ChatUserList.vue'
</script>

<template>
  <n-split direction="horizontal" :max="0.6" :min="0.25" :default-size="0.3">
    <template #1>
      <n-list hoverable clickable>
        <n-list-item>
          <chat-user-list />
        </n-list-item>
        <n-list-item>
          <n-thing title="他在时间门外" content-style="margin-top: 10px;">
            <template #description>
              <n-space size="small" style="margin-top: 4px">
                <n-tag :bordered="false" type="info" size="small">
                  环形公路
                </n-tag>
                <n-tag :bordered="false" type="info" size="small">
                  潜水艇司机
                </n-tag>
              </n-space>
            </template>
            最新的打印机<br>
            复制着彩色傀儡<br>
            早上好我的罐头先生<br>
            让他带你去被工厂敲击
          </n-thing>
        </n-list-item>
      </n-list>
    </template>
    <template #2>
      这是右侧聊天框!!!
    </template>
  </n-split>
</template>

<style scoped>

</style>
