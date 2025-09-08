<template>
  <n-modal
    :show="show"
    @update:show="$emit('update:show', $event)"
    preset="dialog"
    title="好友申请"
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
          <n-tab name="received" :tab="receivedTabTitle">
            收到的申请
          </n-tab>
          <n-tab name="sent" :tab="sentTabTitle">
            发出的申请
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
            <div 
              v-for="request in currentRequests" 
              :key="request.id" 
              class="request-item"
              :class="{ 'processed': request.status !== 'pending' }"
            >
              <div class="user-avatar">
                <n-avatar :src="getDisplayUser(request).avatar" round />
              </div>
              
              <div class="user-info">
                <div class="user-name">{{ getDisplayUser(request).name }}</div>
                <div class="user-email">{{ getDisplayUser(request).email }}</div>
                <div v-if="request.message" class="request-message">
                  {{ request.message }}
                </div>
                <div class="request-time">
                  {{ formatTime(request.createdAt) }}
                </div>
              </div>
              
              <div class="user-action">
                <!-- 待处理的收到申请 -->
                <div v-if="activeTab === 'received' && request.status === 'pending'" class="action-buttons">
                  <n-button
                    type="primary"
                    size="small"
                    @click="handleRequest(request.id, 'approve')"
                    :loading="processingRequestId === request.id"
                  >
                    同意
                  </n-button>
                  <n-button
                    type="error"
                    size="small"
                    @click="handleRequest(request.id, 'reject')"
                    :loading="processingRequestId === request.id"
                  >
                    拒绝
                  </n-button>
                </div>
                
                <!-- 状态标签和删除按钮 -->
                <div v-else class="status-actions">
                  <n-tag
                    :type="getStatusTagType(request.status)"
                    size="medium"
                    round
                    :bordered="false"
                    class="status-tag"
                  >
                    {{ getStatusText(request.status) }}
                  </n-tag>
                  
                  <!-- 删除按钮 -->
                  <n-button
                    v-if="request.status !== 'pending'"
                    type="tertiary"
                    size="small"
                    @click="deleteRequest(request.id)"
                    :loading="deletingRequestId === request.id"
                    class="delete-btn"
                    title="删除记录"
                  >
                    <template #icon>
                      <n-icon><DeleteIcon /></n-icon>
                    </template>
                  </n-button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 空状态 -->
          <div v-else key="empty-state" class="status-container">
            <n-result 
              status="404" 
              :description="activeTab === 'received' ? '暂无收到的好友申请' : '暂无发出的好友申请'"
            />
          </div>
        </transition>
      </div>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import { DeleteOutlined as DeleteIcon } from '@vicons/antd'
import type { FriendRequest } from '@/models/friend'
import { getMockFriendRequests, handleMockFriendRequest, deleteMockFriendRequest } from '@/mock/friendRequests'
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
const activeTab = ref<'received' | 'sent'>('received')
const loading = ref(false)
const processingRequestId = ref<string | null>(null)
const deletingRequestId = ref<string | null>(null)
const friendRequests = ref<FriendRequest[]>([])
const authUser = getAuthUser()

// 计算属性：获取当前标签页的申请列表
const currentRequests = computed(() => {
  return friendRequests.value.filter(request => request.type === activeTab.value)
})

// 计算属性：收到的申请数量（待处理）
const receivedCount = computed(() => {
  return friendRequests.value.filter(req => req.type === 'received' && req.status === 'pending').length
})

// 计算属性：发出的申请数量
const sentCount = computed(() => {
  return friendRequests.value.filter(req => req.type === 'sent').length
})

// 计算属性：标签标题
const receivedTabTitle = computed(() => {
  return receivedCount.value > 0 ? `收到的申请 (${receivedCount.value})` : '收到的申请'
})

const sentTabTitle = computed(() => {
  return sentCount.value > 0 ? `发出的申请 (${sentCount.value})` : '发出的申请'
})

// 方法：获取要显示的用户信息
const getDisplayUser = (request: FriendRequest) => {
  return activeTab.value === 'received' ? request.fromUser : request.toUser
}

// 方法：格式化时间
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

// 方法：获取状态标签类型
const getStatusTagType = (status: string): 'info' | 'success' | 'error' => {
  switch (status) {
    case 'pending': return 'info'
    case 'approved': return 'success'
    case 'rejected': return 'error'
    default: return 'info'
  }
}

// 方法：获取状态文本
const getStatusText = (status: string): string => {
  switch (status) {
    case 'pending': return '待处理'
    case 'approved': return '已同意'
    case 'rejected': return '已拒绝'
    default: return '未知状态'
  }
}

// 方法：加载好友申请列表
const loadFriendRequests = async () => {
  loading.value = true
  try {
    // 这里使用Mock数据，实际项目中应该调用真实API
    friendRequests.value = await getMockFriendRequests(authUser.id)
  } catch (error) {
    message.error('获取好友申请列表失败')
    console.error('Load friend requests error:', error)
  } finally {
    loading.value = false
  }
}

// 方法：处理好友申请（同意/拒绝）
const handleRequest = async (requestId: string, action: 'approve' | 'reject') => {
  processingRequestId.value = requestId
  try {
    // 这里使用Mock函数，实际项目中应该调用真实API
    const success = await handleMockFriendRequest(requestId, action)
    if (success) {
      message.success(action === 'approve' ? '已同意好友申请' : '已拒绝好友申请')
      // 刷新列表
      await loadFriendRequests()
    } else {
      message.error('操作失败，请稍后重试')
    }
  } catch (error) {
    message.error('操作失败，请稍后重试')
    console.error('Handle friend request error:', error)
  } finally {
    processingRequestId.value = null
  }
}

// 方法：删除申请记录
const deleteRequest = async (requestId: string) => {
  deletingRequestId.value = requestId
  try {
    // 这里使用Mock函数，实际项目中应该调用真实API
    const success = await deleteMockFriendRequest(requestId)
    if (success) {
      message.success('已删除申请记录')
      // 刷新列表
      await loadFriendRequests()
    } else {
      message.error('删除失败，请稍后重试')
    }
  } catch (error) {
    message.error('删除失败，请稍后重试')
    console.error('Delete friend request error:', error)
  } finally {
    deletingRequestId.value = null
  }
}

// 方法：标签页切换
const handleTabChange = (value: string) => {
  activeTab.value = value as 'received' | 'sent'
}

// 方法：关闭对话框
const handleClose = () => {
  emit('update:show', false)
}

// 生命周期：组件挂载时加载数据
onMounted(() => {
  loadFriendRequests()
})

// 监听：show属性变化，每次打开时重新加载数据
watch(() => props.show, (newShow) => {
  if (newShow) {
    loadFriendRequests()
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
  padding: 8px;
}

.request-item {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  margin-bottom: 8px;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #fafafa;
}

.request-item:last-child {
  margin-bottom: 0;
}

.request-item:hover {
  background-color: #f8f9fa;
  border-color: #e6f7ff;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.request-item.processed {
  opacity: 0.8;
}

.user-avatar {
  margin-right: 12px;
  flex-shrink: 0;
}

.request-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 2px;
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
  transition: all 0.2s ease !important;
}

:deep(.request-item:hover .n-avatar) {
  border-color: #1890ff !important;
  transform: scale(1.05) !important;
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
</style>