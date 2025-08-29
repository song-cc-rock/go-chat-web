<template>
  <div class="status-wrap" :class="position">
    <n-icon v-if="status === 'sent'" size="16" class="status-icon spin">
      <component :is="LoadingIcon" />
    </n-icon>
    <n-button 
      v-else-if="status === 'failed'" 
      text 
      size="tiny" 
      class="status-icon resend-btn" 
      @click="handleResend"
    >
      <n-icon size="16">
        <component :is="WarningIcon" />
      </n-icon>
    </n-button>
  </div>
</template>

<script setup lang="ts">
import type { ConversationMsgResponse } from '@/models/conversation'
import { Loading3QuartersOutlined as LoadingIcon, ExclamationCircleOutlined as WarningIcon } from '@vicons/antd'

// 定义props
const props = defineProps<{
  status: string;
  position: 'left' | 'right';
  msg: ConversationMsgResponse;
}>()

// 定义事件
const emit = defineEmits<{
  resend: [msg: ConversationMsgResponse]
}>()

// 处理重发
const handleResend = () => {
  emit('resend', props.msg)
}
</script>

<style scoped>
.status-wrap {
  display: inline;
  padding: 5px;
}

.status-wrap.right {
  position: absolute;
}

.status-wrap.left .status-icon.spin.n-icon {
  margin-right: 3px !important;
}

.status-wrap.right .status-icon.spin.n-icon {
  margin-left: 3px !important;
}

.status-icon {
  font-size: 14px !important;
  opacity: 0.7;
  transition: opacity 0.3s;
}

.status-icon:hover {
  opacity: 1;
}

.resend-btn {
  padding: 0;
  min-width: auto;
  height: auto;
  opacity: 0.7;
}

.resend-btn:hover {
  opacity: 1;
  background-color: transparent;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.spin {
  animation: spin 1s linear infinite;
}
</style>