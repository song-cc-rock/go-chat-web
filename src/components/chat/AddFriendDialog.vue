<template>
  <n-modal
    :show="show"
    @update:show="$emit('update:show', $event)"
    preset="dialog"
    title="添加朋友"
    :mask-closable="true"
    :close-on-esc="true"
    :auto-focus="false"
    style="width: 520px; max-width: 90vw;"
    @close="handleClose"
  >
    <div class="add-friend-container">
      <!-- 搜索框 -->
      <div class="search-box">
        <n-input
          v-model:value="keyword"
          placeholder="请输入邮箱或昵称搜索"
          :clearable="true"
          @keypress="handleKeyPress">
          <template #prefix>
            <n-icon :component="UserAddIcon" />
          </template>
        </n-input>
        <n-button
          type="primary"
          @click="handleSearchUsers"
          :loading="searchLoading"
          class="search-btn"
          :disabled="!keyword || keyword.trim() === ''"
        >
          搜索
        </n-button>
      </div>
      
      <!-- 内容区域包装器，保持固定高度 -->
      <div class="content-area">
        <transition name="status-fade" mode="out-in">
          <!-- 搜索结果 -->
          <div v-if="searchResult" key="search-content" class="search-results">
            <div class="user-list">
              <div :key="searchResult.id" class="user-item">
                <div class="user-avatar">
                  <n-avatar :src="searchResult.avatar" round />
                </div>
                <div class="user-info">
                  <div class="user-name">{{ searchResult.nickName }}</div>
                  <div class="user-email">{{ searchResult.mail }}</div>
                </div>
                <div class="user-action">
                  <n-tooltip trigger="hover">
                    <template #trigger>
                      <n-button
                        v-if="searchResult.status === 'not-applied'"
                        type="primary"
                        size="small"
                        @click="addFriend(searchResult.id)"
                        :loading="addFriendLoading"
                        class="add-btn">
                        {{ '好友申请' }}
                      </n-button>
                      <n-tag
                        v-else
                        :type="statusMap[searchResult.status].type"
                        size="medium"
                        round
                        :bordered="false"
                        class="status-tag">
                        {{ statusMap[searchResult.status].text }}
                      </n-tag>
                    </template>
                    <span>{{ statusMap[searchResult.status].tooltip }}</span>
                  </n-tooltip>
                </div>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-else-if="hasSearched && !searchResult && !searchLoading" key="empty-state" class="status-container empty-state">
            <n-result status="500" description="请检查或重新输入"/>
          </div>

          <!-- 初始状态 -->
          <div v-else key="initial-state" class="status-container initial-state">
            <n-result status="404" description="搜索并添加好友" />
          </div>
        </transition>
      </div>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { searchUsers, sendFriendRequest } from '@/api/user.ts'
import type { SearchUserItem } from '@/models/user'
import { useMessage, NTooltip } from 'naive-ui'
import { UserAddOutlined as UserAddIcon } from '@vicons/antd'
import { getAuthUser } from '@/utils/auth'

defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits<{(e: 'update:show', value: boolean): void}>()

const message = useMessage()
const keyword = ref('')
const searchResult = ref<SearchUserItem>()
const searchLoading = ref(false)
const addFriendLoading = ref(false)
const hasSearched = ref(false) // 标记是否已经触发过搜索
const authUser = getAuthUser()

// 搜索用户的函数
const handleSearchUsers = async () => {
  if (!keyword.value.trim()) {
    message.warning('请输入搜索关键词')
    return
  }
  
  searchLoading.value = true
  hasSearched.value = true
  try {
    searchResult.value = await searchUsers(keyword.value)
    // 状态字段会从后端返回，不需要前端初始化
  } catch (error) {
    message.error('搜索失败，请稍后重试')
    console.log(error);
  } finally {
    searchLoading.value = false
  }
}

// 好友申请状态映射
const statusMap: Record<string, { text: string; type: 'info' | 'error' | 'success'; tooltip: string }> = {
  'pending': { text: '待通过', type: 'info', tooltip: '好友申请已发送，等待对方通过' },
  'rejected': { text: '已拒绝', type: 'error', tooltip: '对方已拒绝您的好友申请，请1小时后重新申请' },
  'approved': { text: '已通过', type: 'success', tooltip: '你们已是好友关系' }
}

// 添加好友的函数
const addFriend = async (userId: string) => {
  addFriendLoading.value = true
  try {
    var friendApply = {
      fromId: authUser.id,
      toId: userId,
      createdAt: Date.now()
    }
    const success = await sendFriendRequest(friendApply)
    if (success) {
      message.success(`已发送好友请求`)
    } else {
      message.warning('添加好友失败')
    }
  } catch (error) {
    message.error('添加好友失败，请稍后重试')
    console.error('Add friend error:', error)
  } finally {
    addFriendLoading.value = false
  }
}

// 按Enter键触发搜索
const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    handleSearchUsers()
  }
}

watch(keyword, (newKeyword) => {
  if (!newKeyword || newKeyword.trim() === '') {
    searchLoading.value = false
    searchResult.value = undefined
    hasSearched.value = false // 重置搜索状态
  }
})

const handleClose = () => {
  searchLoading.value = false
  keyword.value = ''
  searchResult.value = undefined
  hasSearched.value = false // 重置搜索状态
  emit('update:show', false)
}

// 动画事件处理（可选）
const onEnter = (el: Element) => {
  // 渐入动画开始
}

const onLeave = (el: Element) => {
  // 渐出动画开始
}

const onAfterEnter = () => {
  // 渐入动画完成
}

const onAfterLeave = () => {
  // 渐出动画完成
}
</script>

<style scoped>
.add-friend-container {
  padding: 24px;
}

/* 内容区域最小高度保持稳定 */
.content-area {
  min-height: 260px; /* 设置固定最小高度 */
}

.search-box {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  align-items: center;
}

.search-box .n-input {
  flex: 1;
}

.search-btn {
  min-width: 80px;
}

.search-results {
  margin-top: 16px;
  height: 220px;
  display: flex;
  flex-direction: column;
}

.result-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
  font-weight: 600;
  padding: 0 4px;
}

.user-list {
  flex: 1;
  overflow-y: auto;
  border-radius: 8px;
  padding: 8px;
}

.status-tag {
  font-weight: bold;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  margin-bottom: 8px;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #fafafa;
}

.user-item:last-child {
  margin-bottom: 0;
}

.user-item:hover {
  background-color: #f8f9fa;
  border-color: #e6f7ff;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.user-avatar {
  margin-right: 12px;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.user-email {
  font-size: 13px;
  color: #999;
}

.user-action {
  margin-left: 12px;
  flex-shrink: 0;
}

.add-btn {
  min-width: 60px;
  height: 32px;
  font-size: 13px;
  border-radius: 6px;
}

.status-tag {
  min-width: 60px;
  font-size: 13px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-container {
  margin-top: 16px;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-content {
  text-align: center;
  padding: 20px;
}

.status-icon {
  margin-bottom: 20px;
  color: #1890ff;
  opacity: 0.8;
}

.status-text {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  line-height: 1.4;
}

.status-hint {
  font-size: 13px; /* 从14px改为13px */
  color: #888; /* 从#666改为#888，更淡一些 */
  line-height: 1.5; /* 从1.6改为1.5 */
  max-width: 280px;
  margin: 0 auto;
  font-weight: 400; /* 添加字体权重 */
}

/* 空状态特殊样式 */
.empty-state .status-icon {
  color: #faad14;
}

/* 初始状态特殊样式 */
.initial-state .status-icon {
  color: #52c41a;
}

/* 搜索结果动画 */
.search-slide-enter-active {
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.search-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.55, 0.06, 0.68, 0.19);
}

.search-slide-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.search-slide-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.search-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.search-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* 状态容器从左到右渐入动画 */
.status-fade-enter-active {
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-delay: 0.1s; /* 稍微延迟显示 */
}

.status-fade-leave-active {
  transition: all 0.2s ease;
}

.status-fade-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.status-fade-enter-to {
  opacity: 1;
  transform: translateX(0);
}

.status-fade-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.status-fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>

<!-- 全局样式优化 - 只优化modal外层圆角 -->
<style>
/* 模态框最外层圆角 */
:deep(.n-modal) {
  border-radius: 12px !important;
  overflow: hidden !important;
}

/* 增强遮罩层效果 */
:deep(.n-modal-mask) {
  background-color: rgba(0, 0, 0, 0.5) !important;
  backdrop-filter: blur(4px) !important;
}

/* 优化头像样式 */
:deep(.n-avatar) {
  width: 40px !important;
  height: 40px !important;
  border: 2px solid #f0f0f0 !important;
  transition: all 0.2s ease !important;
}

:deep(.user-item:hover .n-avatar) {
  border-color: #1890ff !important;
  transform: scale(1.05) !important;
}

.n-result-header__description {
  margin-top: 25px !important;
  font-size: 14px !important; /* 添加更小的字体 */
  font-weight: 300 !important; /* 更轻的字体权重 */
  color: #aaa !important; /* 更淡的颜色 */
  opacity: 0.8; /* 添加透明度 */
}

.n-input .n-input__placeholder span {
    font-size: 13px;
    margin-top: 2px;
    margin-left: 2px;
}
</style>