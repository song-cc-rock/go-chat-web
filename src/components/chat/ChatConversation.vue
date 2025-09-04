<template>
  <div class="chat-container">
    <!-- 加载更多 -->
    <transition name="load-more-fade">
      <div v-if="hasMoreHistory && showLoadMoreBtn" class="load-more-container">
        <n-button
          v-if="!isLoadingMore"
          text
          tag="a"
          size="small"
          type="primary"
          @click="loadMoreHistory"
          class="load-more-btn"
        >
          <template #icon>
            <n-icon><component :is="HistoryIcon" /></n-icon>
          </template>
          <span class="load-more-text">查看历史消息</span>
        </n-button>
        <div v-else class="loading-container">
          <n-spin :size="16" />
          <span class="loading-text">加载中...</span>
        </div>
      </div>
    </transition>
    
  <!-- 对话历史列表 -->
    <n-list 
      v-if="showMessages" 
      v-for="[key, value] in Array.from(conversationMap.entries())" 
      :key="key.getTime()" 
      class="group-chat" 
      :show-divider="false"
    >
      <div class="last-time-tag"><n-tag size="small">{{ getLastConversationTime(key.getTime()) }}</n-tag></div>
      <chat-message-item 
        v-for="msg in value" 
        :key="msg.id" 
        :msg="msg" 
        :current-user-id="authUser.id"
        @download="downloadFile"
        @resend="onResend"
      />
    </n-list>

    <!-- 滚动到底部按钮 -->
    <n-button
      v-if="showScrollToBottomBtn"
      class="scroll-to-bottom-btn"
      size="small"
      :bordered="false"
      circle
      @click="scrollToBottom()"
      :style="{ opacity: scrollToBottomBtnOpacity }"
    >
      <n-icon size="21"><component :is="BackBottomIcon" /></n-icon>
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, watch, onMounted, onUnmounted, nextTick, type Ref } from 'vue'
import type { ConversationResponse, ConversationMsgResponse } from '@/models/conversation'
import { getConversationHis } from '@/api/conversation'
import { getAuthUser } from '@/utils/auth'
import WebSocketService from '@/utils/websocket'
import { VerticalAlignBottomOutlined as BackBottomIcon, HistoryOutlined as HistoryIcon } from '@vicons/antd'
import eventBus from '@/utils/eventBus'
import ChatMessageItem from '@/components/chat/ChatMessageItem.vue'
import { useMessage } from 'naive-ui'
import { downloadFileById } from '@/api/file'

const message = useMessage()
const props = defineProps<{
  conversation: ConversationResponse | undefined;
}>();
// key: 上一次对话时间分组, value: 对话内容集合
const conversationMap = ref<Map<Date, ConversationMsgResponse[]>>(new Map())
const authUser = getAuthUser()
// 注入WebSocket服务
const wsService = inject<Ref<WebSocketService | null>>('wsService', ref(null))

// 分页加载相关状态
const currentPage = ref(1)
const pageSize = 30
const hasMoreHistory = ref(true)
const isLoadingMore = ref(false)
const showLoadMoreBtn = ref(false)
// 控制消息列表的显示，用于优化初始加载体验
const showMessages = ref(false)

onMounted(async () => {
  // 监听新消息和消息状态变化
  if (wsService.value) {
    watch(
      () => wsService,
      (service) => {
        if (service.value && service.value.messages) {
          const newMessages = service.value.messages
          if (newMessages && newMessages.length > 0) {
            // 分离状态更新消息和新消息
            const updatedMessages = newMessages.filter(msg => 
              msg.send === authUser.id && 
              (msg.status === 'success' || msg.status === 'failed')
            );

            // 处理所有新消息
            const relevantMessages = newMessages.filter(msg => 
              props.conversation && (msg.send === props.conversation.targetUserId || msg.receiver === props.conversation.targetUserId)
            );

            // 先处理状态更新
            if (updatedMessages.length > 0) {
              updateConversationMap(updatedMessages);
            }

            // 再处理新消息
            if (relevantMessages.length > 0) {
              updateConversationMap(relevantMessages);
            }

            // 有新消息就滚动到底部
            if (updatedMessages.length > 0 || relevantMessages.length > 0) {
              scrollToBottom();
            }
          }
        }

      },
      { deep: true }
    )
  }
})

// 重置分页状态
const resetPagination = () => {
  currentPage.value = 1
  hasMoreHistory.value = true
  isLoadingMore.value = false
}

// 加载对话历史
const loadConversationHistory = async (conversationId: string, page: number, isInitial: boolean = false) => {
  try {
    const msgList = await getConversationHis(conversationId, page, pageSize)
    
    if (msgList.length < pageSize) {
      hasMoreHistory.value = false
    }
    
    if (isInitial) {
      // 初始加载，直接设置
      conversationMap.value = getConversationMap(msgList)
    } else {
      // 加载更多历史消息，合并到现有数据的前面
      const historyMap = getConversationMap(msgList)
      const currentMap = conversationMap.value
      
      // 将历史数据放在前面，现有数据放在后面
      // 保持时间顺序：较早的消息在上，较新的消息在下
      const mergedMap = new Map([...historyMap, ...currentMap])
      conversationMap.value = mergedMap
    }
    
    currentPage.value = page
  } catch (error) {
    console.error('加载对话历史失败:', error)
  }
}

// 加载更多历史消息
const loadMoreHistory = async () => {
  if (!props.conversation?.id || isLoadingMore.value || !hasMoreHistory.value) {
    return
  }
  
  const scrollContainer = document.querySelector('.n-scrollbar-container')
  let initialScrollHeight = 0
  let initialScrollTop = 0
  
  // 记录加载前的滚动位置和内容高度
  if (scrollContainer) {
    initialScrollHeight = scrollContainer.scrollHeight
    initialScrollTop = scrollContainer.scrollTop
  }
  
  isLoadingMore.value = true
  
  try {
    await loadConversationHistory(props.conversation.id, currentPage.value + 1)
    
    // 加载完成后，保持用户上次查看的位置
    if (scrollContainer) {
      // 使用nextTick确保DOM已更新
      nextTick(() => {
        // 计算新增内容的高度
        const newScrollHeight = scrollContainer.scrollHeight
        const addedHeight = newScrollHeight - initialScrollHeight
        
        // 调整滚动位置，保持在加载前的相对位置
        scrollContainer.scrollTop = initialScrollTop + addedHeight
      })
    }
  } finally {
    // 添加延迟结束动画，让用户看到loading效果
    setTimeout(() => {
      isLoadingMore.value = false
    }, 800)
  }
}

// 当选中的会话发生变化时，重新加载历史消息并重置分组
watch(
  () => props.conversation?.id,
  async (newId) => {
    if (!newId) {
      conversationMap.value = new Map()
      resetPagination()
      return
    }

    // 重置分页状态
    resetPagination()
    
    // 加载第一页数据
    await loadConversationHistory(newId, 1, true)
    eventBus.emit('refreshUnreadCount')
    
    // 延迟一小段时间确保DOM已更新
    setTimeout(() => {
      // 计算滚动到底部所需的位置，但先不显示内容
      const scrollContainer = document.querySelector('.n-scrollbar-container')
      
      if (scrollContainer) {
        // 临时显示内容以计算滚动高度
        showMessages.value = true
        
        // 在下一个DOM更新周期计算滚动位置
        nextTick(() => {
          // 直接滚动到底部（无动画）
          scrollContainer.scrollTop = scrollContainer.scrollHeight
          
          // 内容已经在底部位置了，保持显示
          showMessages.value = true
        })
      } else {
        // 如果没有滚动容器，直接显示内容
        showMessages.value = true
      }
    }, 100)
  },
  { immediate: true }
)

// 更新对话映射
const updateConversationMap = (newMessages: ConversationMsgResponse[]) => {
  const currentMap = conversationMap.value
  newMessages.forEach((message) => {
    // 检查是否是更新现有消息的状态
    // 查找现有消息，优先匹配id，其次匹配clientTmpId或actualId
    // 优化匹配逻辑：优先匹配actualId，然后是clientTmpId，最后是id
    const existingEntry = Array.from(currentMap.entries()).find(([_, messages]) => {
      return messages.some(m => 
        (message.actualId && m.actualId === message.actualId) || 
        (message.clientTmpId && m.clientTmpId === message.clientTmpId) || 
        m.id === message.id
      );
    });

    if (existingEntry) {
      // 找到现有消息，更新其状态
      const [key, messages] = existingEntry;
      const index = messages.findIndex(m => m.id === message.id);
      if (index !== -1) {
        messages[index] = { ...messages[index], ...message };
      }
    } else {
      // 新消息，按时间分组添加
      // 将秒级时间戳转换为毫秒级再创建Date对象
      const messageTime = new Date(message.created_at);
      let added = false

      // 尝试添加到现有组
      currentMap.forEach((messages, key) => {
        const timeDiff = messageTime.getTime() - key.getTime();
        const fiveMinutes = 5 * 60 * 1000;

        if (timeDiff <= fiveMinutes) {
          messages.push(message);
          added = true;
        }
      })

      // 如果没有添加到现有组，创建新组
      if (!added) {
        currentMap.set(messageTime, [message]);
      }
    }
  })

  // 更新Map以触发重新渲染
  conversationMap.value = new Map(currentMap)
}

// 滚动到底部
// 控制滚动到底部按钮的显示和透明度
const showScrollToBottomBtn = ref(false)
const scrollToBottomBtnOpacity = ref(1)
const isScrollingToBottom = ref(false)

// 监听滚动事件
onMounted(() => {
  const scrollContainer = document.querySelector('.n-scrollbar-container')
  if (scrollContainer) {
    const handleScroll = () => {
      // 检查是否滚动到顶部（显示加载更多按钮）
      const isAtTop = scrollContainer.scrollTop <= 5
      showLoadMoreBtn.value = isAtTop && hasMoreHistory.value && !isLoadingMore.value
      
      // 检查是否滚动到底部附近（100px内）
      const isNearBottom = scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight < 100
      if (isNearBottom && showScrollToBottomBtn.value && !isScrollingToBottom.value) {
        // 接近底部时，按钮淡出
        scrollToBottomBtnOpacity.value = 0
        setTimeout(() => {
          showScrollToBottomBtn.value = false
          // 重置透明度，为下次显示做准备
          scrollToBottomBtnOpacity.value = 1
        }, 300)
      } else if (!isNearBottom && !showScrollToBottomBtn.value && !isScrollingToBottom.value) {
        // 远离底部时，显示按钮
        showScrollToBottomBtn.value = true
        scrollToBottomBtnOpacity.value = 1
      }
    }

    // 初始检查
    handleScroll()
    // 添加滚动监听
    scrollContainer.addEventListener('scroll', handleScroll)
    // 组件卸载时移除监听
    onUnmounted(() => {
      scrollContainer.removeEventListener('scroll', handleScroll)
    })
  }
})

const scrollToBottom = (smooth = true) => {
  // 设置滚动中标志
  isScrollingToBottom.value = true
  
  // 使用nextTick确保DOM更新后再滚动
  nextTick(() => {
    const scrollContainer = document.querySelector('.n-scrollbar-container')
    if (scrollContainer) {
      // 立即隐藏按钮
      showScrollToBottomBtn.value = false
      
      // 根据参数决定是否使用平滑滚动
      if (smooth) {
        scrollContainer.scrollTo({ 
          top: scrollContainer.scrollHeight, 
          behavior: 'smooth' 
        })
      } else {
        // 直接跳到底部，无动画
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  })
  
  // 滚动完成后重置标志
  setTimeout(() => {
    isScrollingToBottom.value = false
    scrollToBottomBtnOpacity.value = 1
  }, smooth ? 800 : 100)
}

const getConversationMap = (res: ConversationMsgResponse[]) => {
  const groupedMap = new Map<Date, ConversationMsgResponse[]>()

  if (!res || res.length === 0) {
    return groupedMap
  }

  // 后端返回的数据是按时间倒序排列，需要先反转为正序（早到晚）
  const sortedMessages = [...res].reverse()

  let currentGroupKey: Date | null = null
  let currentGroup: ConversationMsgResponse[] = []

  sortedMessages.forEach((message) => {
    // 将秒级时间戳转换为毫秒级再创建Date对象
    const messageTime = new Date(message.created_at * 1000)

    if (currentGroupKey === null) {
      // First message, start a new group
      currentGroupKey = messageTime
      currentGroup = [message]
    } else {
      // Check if message is within 5 minutes of the current group's start time
      // Since messages are sorted, messageTime is always >= currentGroupKey, so no Math.abs needed.
      const timeDiff = messageTime.getTime() - currentGroupKey.getTime()
      const fiveMinutes = 5 * 60 * 1000 // 5 minutes in milliseconds

      if (timeDiff <= fiveMinutes) {
        // Add to current group
        currentGroup.push(message)
      } else {
        // Save current group and start a new one
        groupedMap.set(currentGroupKey, [...currentGroup])
        currentGroupKey = messageTime
        currentGroup = [message]
      }
    }
  })

  // Don't forget to add the last group
  if (currentGroupKey && currentGroup.length > 0) {
    groupedMap.set(currentGroupKey, [...currentGroup])
  }

  return groupedMap
}

const getLastConversationTime = (time: number) => {
  // 创建Date对象（time是秒级时间戳）
  const date = new Date(time);
  
  const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();

  // 创建当天本地时间（0点0分0秒）
  let today = new Date();
  today = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  if (date.getTime() > today.getTime()) {
    // 当天对话
    return `${hour}:${minute}`;
  } else {
    const currentYear = new Date().getFullYear();
    const dateYear = date.getFullYear();
    const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    if (dateYear === currentYear) {
      // 当年对话
      return `${month}-${day} ${hour}:${minute}`;
    } else {
      // 非当年对话
      return `${date.getFullYear()}-${month}-${day} ${hour}:${minute}`;
    }
  }
}

// 下载文件
const downloadFile = (msg: ConversationMsgResponse) => {
  if (msg.fileInfo && msg.fileInfo.id) {
    downloadFileById(msg.fileInfo.id);
  } else {
    message.error('无法下载, 文件已经过时!')
  }
}

const onResend = async (msg: ConversationMsgResponse) => {
  if (!props.conversation || !wsService.value || !wsService.value.messages || !wsService.value.messages) return
  
  // 如果是文件消息，需要重新上传文件
  if (msg.type === 'file') {
    // 文件消息重发需要特殊处理，这里只是重发已上传成功的文件消息
    const clientTmpId = `temp-${Date.now()}`
    const newMessage: ConversationMsgResponse = {
      id: clientTmpId,
      send: authUser.id,
      receiver: props.conversation.targetUserId,
      content: msg.content,
      created_at: Date.now(),
      avatar: authUser.avatar || '',
      status: 'sent',
      actualId: '',
      clientTmpId: clientTmpId,
      type: 'file',
      // 保留文件相关属性
      fileInfo: {
        name: msg.fileInfo.name,
        size: msg.fileInfo.size,
        type: msg.fileInfo.type,
        path: msg.fileInfo.path,
      }
    }
    
    // local push
    wsService.value.messages.push(newMessage)
    // send
    wsService.value.sendMessage({
      ...newMessage,
      conversation_id: props.conversation.id,
    })
  } else {
    // 文本消息重发
    const clientTmpId = `temp-${Date.now()}`
    const newMessage: ConversationMsgResponse = {
      id: clientTmpId,
      send: authUser.id,
      receiver: props.conversation.targetUserId,
      content: msg.content,
      created_at: Date.now(),
      avatar: authUser.avatar || '',
      status: 'sent',
      actualId: '',
      clientTmpId: clientTmpId,
      // 保留文件相关属性
      fileInfo: {
        name: '',
        size: 0,
        type: '',
        path: '',
      }
    }
    // local push
    wsService.value.messages.push(newMessage)
    // send
    wsService.value.sendMessage({
      ...newMessage,
      conversation_id: props.conversation.id,
    })
  }
}
</script>

<style scoped>
.load-more-text {
  margin-top: 2px;
}

.loading-text {
  margin-top: 2px;
}

/* 加载更多按钮的过渡动画 */
.load-more-fade-enter-active,
.load-more-fade-leave-active {
  transition: all 0.3s ease;
}

.load-more-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.load-more-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.load-more-container {
  text-align: center;
  padding: 2px 0;
  min-height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.load-more-btn {
  color: #18a058 !important;
  font-size: 12px;
  text-decoration: none;
  transition: all 0.3s ease;
  margin-right: 20px;
}

.load-more-btn:hover {
  color: #36ad6a !important;
  text-decoration: none;
}

.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  /* 保持和父容器一样的尺寸，不额外添加padding */
}

.loading-text {
  font-size: 12px;
  color: #18a058;
  font-weight: 500;
}

.group-chat {
  padding-top: 10px;
  padding-right: 20px;
}

.chat-box {
  position: relative;
  display: inline-block;
  margin: 0 0 0.5em 0;
  padding: 10px 12px;
  min-width: 20px;
  max-width: 70%;
  color: black;
  font-size: 13px;
  font-weight: 400;
  background: whitesmoke;
  border-radius: 10px;
  line-height: 1.0;
}

.chat-box:before {
  content: "";
  position: absolute;
  top: 5px;
  border: 6px solid transparent;
}

.chat-box p {
  margin: 0;
  padding: 0;
}

/* emoji样式 */
:deep(.chat-box p .emoji-in-text) {
  font-size: 18px !important;
  vertical-align: middle !important;
  display: inline-block !important;
}

.group-chat .n-list-item {
  padding: 0 0 10px 0;
  width: 100%;
  align-items: flex-start;
  min-height: 100%;
}

.box-left .chat-box{
  background-color: whitesmoke;
}

.box-left .chat-box:hover {
  background-color: #dcdcdc;
}

.box-left .chat-box:hover:before {
  border-right: 10px solid #dcdcdc;
}

.box-left .chat-box:before {
  border-right: 10px solid whitesmoke;
}

.box-left .chat-box:before {
  margin-left: -24px;
}

.box-right .chat-box {
  background-color: #07C16F;
}

.box-right .chat-box:hover {
  background-color: #18a058;
}

.box-right .chat-box:before {
  border-left: 10px solid #07C16F;
  left: 95%;
  margin-left: 0;
}

.box-right .chat-box:hover:before {
  border-left: 10px solid #18a058;
}

.last-time-tag {
  text-align: center;
  margin-bottom: 10px;
}  

.status-icon {
  vertical-align: middle;
  color: rgba(0, 0, 0, 0.45);
}

.resend-btn {
  padding: 0;
  margin-left: 4px;
  color: rgba(0, 0, 0, 0.45);
}

.spin {
  display: inline-block;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.scroll-to-bottom-btn {
    position: absolute;
    bottom: 5px;
    right: 50%;
    z-index: 9999;
    border: none !important;
    outline: none;
    background-color: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.3s;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.scroll-to-bottom-btn:hover {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    background-color: rgba(255, 255, 255, 1);
    transform: translateY(-2px);
}
</style>
