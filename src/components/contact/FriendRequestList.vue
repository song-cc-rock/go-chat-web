<template>
  <n-modal
    :show="show"
    @update:show="$emit('update:show', $event)"
    preset="dialog"
    title="申请列表"
    :mask-closable="true"
    :close-on-esc="true"
    :auto-focus="false"
    style="width: 600px; max-width: 90vw;"
    @close="handleClose"
  >
    <div class="friend-request-container">
      <!-- 标签页切换 -->
      <div class="tab-container">
        <n-tabs v-model:value="activeTab" type="line" @update:value="handleTabChange">
          <n-tab name="sent">
            发出
          </n-tab>
          <n-tab name="received">
            收到
          </n-tab>
        </n-tabs>
      </div>
      
      <!-- 内容区域 -->
      <div class="content-area">
        <transition name="tab-fade" mode="out-in">
          <!-- 加载状态 -->
          <div v-if="loading" key="loading" class="status-container">
            <n-spin size="medium">
              <template #description>
                <span class="loading-text">加载中...</span>
              </template>
            </n-spin>
          </div>
          
          <!-- 申请列表 -->
          <div v-else-if="currentRequests.length > 0" key="request-list" class="request-list">
            <n-virtual-list style="max-height: 240px" :item-size="42" item-resizable :items="currentRequests">
              <template #default="{ item }">
                <div class="request-item" :key="item.id"> 
                  <div class="user-avatar">
                    <n-avatar :src="item.avatar" round />
                  </div>
                  
                  <div class="user-info">
                    <div class="user-name-row">
                      <span class="user-name">{{ item.name }}</span>
                      <n-popover v-if="item.message" trigger="hover" :show-arrow="false">
                        <template #trigger>
                          <n-tag 
                            round 
                            :bordered="false" 
                            type="success" 
                            size="small"
                            class="verification-tag">
                            消息
                            <template #icon>
                              <n-icon :component="InfoIcon" size="14" />
                            </template>
                          </n-tag>
                        </template>
                        <span>{{ item.message }}</span>
                      </n-popover>
                    </div>
                    <div class="request-time">
                      {{ formatTime(item.createdAt * 1000) }}
                    </div>
                  </div>
                  
                  <!-- 状态标签区域 -->
                  <div class="user-action" v-if="activeTab === 'sent' && item.status">
                    <n-tag
                      :type="getStatusType(item.status)"
                      size="medium"
                      round
                      :bordered="false"
                      class="status-tag">
                      {{ getStatusText(item.status) }}
                    </n-tag>
                  </div>
                  
                </div>
              </template>
            </n-virtual-list>
          </div>
          
          <!-- 空状态 -->
          <div v-else key="empty-state" class="status-container">
            <n-result 
              status="404" 
              :description="activeTab === 'received' ? '暂无收到的申请' : '暂无发出的申请'"
            />
          </div>
        </transition>
      </div>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useMessage } from 'naive-ui'
import type { FriendRequest } from '@/models/friend'
import { InfoCircleOutlined as InfoIcon } from '@vicons/antd'
import { getApplies } from '@/api/friend'
import { getAuthUser } from '@/utils/auth'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

// Props定义
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

// Events定义
const emit = defineEmits<{(e: 'update:show', value: boolean): void}>()

// 响应式数据
const message = useMessage()
const activeTab = ref<'received' | 'sent'>('sent')
const loading = ref(false)
const friendRequests = ref<FriendRequest[]>([])
const receivedRequests = ref<FriendRequest[]>([])


// 计算属性：当前显示的申请列表
const currentRequests = computed(() => {
  return activeTab.value === 'sent' ? friendRequests.value : receivedRequests.value
})

const formatTime = (timestamp: number) => {
  try {
    return formatDistanceToNow(new Date(timestamp), { 
      addSuffix: true, 
      locale: zhCN 
    })
  } catch {
    return '刚刚'
  }
}

// 状态映射方法
const getStatusType = (status: string): 'info' | 'error' | 'success' => {
  switch (status) {
    case 'pending': return 'info'
    case 'rejected': return 'error'
    case 'approved': return 'success'
    default: return 'info'
  }
}

const getStatusText = (status: string): string => {
  switch (status) {
    case 'pending': return '待通过'
    case 'rejected': return '已拒绝'
    case 'approved': return '已通过'
    default: return '未知状态'
  }
}

const loadSendRequests = async () => {
  loading.value = true
  try {
    friendRequests.value = await getApplies()
  } catch (error) {
    console.error('获取发出的申请失败:', error)
  } finally {
    loading.value = false
  }
}

const loadReceivedRequests = async () => {
  loading.value = true
  try {
    receivedRequests.value = []
  } catch (error) {
    message.error('获取收到的申请失败')
  } finally {
    loading.value = false
  }
}

const loadDataByTab = () => {
  if (activeTab.value === 'sent') {
    loadSendRequests()
  } else {
    loadReceivedRequests()
  }
}

const handleTabChange = (value: string) => {
  activeTab.value = value as 'received' | 'sent'
  loadDataByTab() // 切换Tab时加载对应数据
}

const handleClose = () => {
  emit('update:show', false)
}

watch(() => props.show, (newShow) => {
  if (newShow) {
    loadDataByTab()
  }
}, { immediate: false })

</script>

<style scoped>
.friend-request-container {
  padding: 24px;
}

.tab-container {
  margin-bottom: 20px;
}

.content-area {
  min-height: 320px;
}

.status-container {
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.loading-text {
  margin-top: 12px;
  font-size: 14px;
  color: #666;
}

.request-list {
  max-height: 320px;
  overflow-y: auto;
  border-radius: 8px;
  padding: 8px 8px 16px 8px;
}

.request-item {
  display: flex;
  align-items: flex-start;
  padding: 12px 16px;
  margin-bottom: 8px;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #fafafa;
  min-height: auto;
  position: relative;
  isolation: isolate;
}

.request-item:hover {
  background-color: #f8f9fa !important;
  border-color: #e6f7ff !important;
}

.request-item.processed {
  opacity: 0.8;
}

.user-avatar {
  margin-right: 12px;
  flex-shrink: 0;
  align-self: center;
}

.user-info {
  flex: 1;
  min-width: 0;
  padding-top: 2px;
}

.user-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 2px;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.verification-message {
  font-size: 11px;
  color: #1890ff;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 10px;
  background: rgba(24, 144, 255, 0.1);
  border: 1px solid rgba(24, 144, 255, 0.2);
  transition: all 0.2s ease;
  white-space: nowrap;
  position: relative;
  z-index: 1;
}

.verification-message:hover {
  background: rgba(24, 144, 255, 0.15) !important;
  border-color: rgba(24, 144, 255, 0.3) !important;
  transform: scale(1.05);
}

.verification-tag {
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.user-email {
  font-size: 12px;
  font-weight: 400;
  color: rgb(179, 179, 179);
}

.request-message {
  font-size: 12px;
  color: #888;
  margin: 4px 0;
  line-height: 1.4;
  background: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
  border-left: 2px solid #1890ff;
}

.request-time {
  font-size: 12px;
  font-weight: 400;
  color: rgb(185, 185, 185);
  margin-top: 2px;
}

.user-action {
  margin-left: 12px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 80px;
}

.status-tag {
  min-width: 60px;
  font-size: 13px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
}

.user-action {
  margin-left: 12px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 140px;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-end;
}

.status-tag {
  min-width: 60px;
  font-size: 13px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
}

.delete-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  color: #999;
}

.delete-btn:hover {
  color: #ff4d4f;
  background-color: #fff1f0;
}

/* 标签页切换动画 */
.tab-fade-enter-active {
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.tab-fade-leave-active {
  transition: all 0.2s ease;
}

.tab-fade-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.tab-fade-enter-to {
  opacity: 1;
  transform: translateX(0);
}

.tab-fade-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.tab-fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* 滚动条样式 */
.request-list::-webkit-scrollbar {
  width: 6px;
}

.request-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.request-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.request-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>

<!-- 全局样式优化 -->
<style>
/* 优化标签页样式 */
:deep(.n-tabs .n-tabs-nav) {
  background-color: #f8f9fa !important;
  border-radius: 8px !important;
  padding: 4px !important;
}

:deep(.n-tabs .n-tabs-tab) {
  border-radius: 6px !important;
  font-weight: 500 !important;
}

/* 优化头像样式 */
:deep(.request-item .n-avatar) {
  width: 40px !important;
  height: 40px !important;
  border: 2px solid #f0f0f0 !important;
  transition: border-color 0.2s ease !important;
}

:deep(.request-item:hover .n-avatar) {
  border-color: #1890ff !important;
}

/* 优化模态框样式 */
:deep(.n-modal) {
  border-radius: 12px !important;
  overflow: hidden !important;
}

:deep(.n-modal-mask) {
  background-color: rgba(0, 0, 0, 0.5) !important;
  backdrop-filter: blur(4px) !important;
}

/* 优化结果页面描述样式 - 根据规范调整为12px字体 */
:deep(.n-result-header__description) {
  margin-top: 25px !important;
  font-size: 12px !important;
  font-weight: 300 !important;
  color: #aaa !important;
  opacity: 0.8;
}

.verification-tag .n-tag__content {
  margin-top: 2px;
}

.request-list .v-vl {
  margin-right: 16px;
}

.request-list .v-vl-items {
  padding-bottom: 1px!important;
}
</style>