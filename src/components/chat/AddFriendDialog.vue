<template>
  <n-dialog
    :show="show"
    @update:show="$emit('update:show', $event)"
    title="添加朋友"
    width="450px"
    :close-on-esc="false"
  >
    <div class="add-friend-container">
      <!-- 搜索框 -->
      <div class="search-box">
        <n-input
          v-model:value="keyword"
          placeholder="请输入邮箱或用户名搜索"
          @keypress="handleKeyPress"
        />
        <n-button
          type="primary"
          @click="handleSearchUsers"
          :loading="searchLoading"
          class="search-btn"
        >
          搜索
        </n-button>
      </div>
      
      <!-- 搜索结果 -->
      <div class="search-results" v-if="searchResults.length > 0">
        <div class="result-title">搜索结果</div>
        <n-list
          class="user-list"
          :bordered="false"
          :show-divider="true"
        >
          <n-list-item
            v-for="user in searchResults"
            :key="user.id"
            class="user-item"
          >
            <template #prefix>
              <n-avatar :src="user.avatar" round />
            </template>
            <n-thing :title="user.name" :description="user.email">
              <template #action>
                <n-button
                  type="primary"
                  size="small"
                  @click="addFriend(user.id, user.name)"
                  :loading="addFriendLoading"
                >
                  添加
                </n-button>
              </template>
            </n-thing>
          </n-list-item>
        </n-list>
      </div>
      
      <!-- 空状态 -->
      <div v-else-if="!searchLoading && keyword" class="empty-state">
        <n-icon size="48" class="empty-icon">
          <UserAddIcon />
        </n-icon>
        <div class="empty-text">未找到相关用户</div>
        <div class="empty-hint">请尝试其他关键词或检查拼写</div>
      </div>
      
      <!-- 初始状态 -->
      <div v-else-if="!keyword" class="initial-state">
        <div class="initial-text">搜索并添加好友</div>
        <div class="initial-hint">输入邮箱或用户名进行搜索</div>
      </div>
    </div>
  </n-dialog>
</template>

<script setup lang="ts">
import { UserAddOutlined as UserAddIcon } from '@vicons/antd'
import { ref } from 'vue'
import { searchUsers, sendFriendRequest, type SearchUserItem } from '@/api/user.ts'
import { useMessage } from 'naive-ui'

defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits<{(e: 'update:show', value: boolean): void}>()

const message = useMessage()
const keyword = ref('')
const searchResults = ref<SearchUserItem[]>([])
const searchLoading = ref(false)
const addFriendLoading = ref(false)

// 搜索用户的函数
const handleSearchUsers = async () => {
  if (!keyword.value.trim()) {
    message.warning('请输入搜索关键词')
    return
  }
  
  searchLoading.value = true
  try {
    // 调用真实的搜索用户API
    const results = await searchUsers(keyword.value)
    searchResults.value = results
    
    // 如果搜索结果为空，显示提示消息
    if (results.length === 0) {
      message.info('未找到匹配的用户')
    }
  } catch (error) {
    message.error('搜索失败，请稍后重试')
    console.error('Search error:', error)
  } finally {
    searchLoading.value = false
  }
}

// 添加好友的函数
const addFriend = async (userId: string, userName: string) => {
  addFriendLoading.value = true
  try {
    // 调用真实的发送好友请求API
    const response = await sendFriendRequest(userId)
    
    if (response.success) {
      message.success(response.message || `已发送好友请求给 ${userName}`)
      // 关闭弹窗
      emit('update:show', false)
    } else {
      message.warning(response.message || '添加好友失败')
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
</script>

<style scoped>
.add-friend-container {
  padding: 10px 0;
}

.search-box {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.search-box .n-input {
  flex: 1;
}

.search-btn {
  min-width: 80px;
}

.search-results {
  margin-top: 10px;
}

.result-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  font-weight: 500;
}

.user-list {
  max-height: 300px;
  overflow-y: auto;
}

.user-item {
  cursor: pointer;
}

.user-item:hover {
  background-color: #f5f5f5;
}

.empty-state,
.initial-state {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.empty-icon {
  margin-bottom: 12px;
}

.empty-text,
.initial-text {
  font-size: 16px;
  margin-bottom: 4px;
  color: #666;
}

.empty-hint,
.initial-hint {
  font-size: 14px;
  color: #999;
}
</style>