<template>
  <div class="header">
    <div class="to-user">
      <span class="chat-name-title">平克·弗洛伊德</span>
    </div>
    <n-button text>
      <n-icon size="30" :component="MoreIcon" class="more-btn" />
    </n-button>

  </div>
  <div class="content">
    <n-scrollbar style="max-height: 100%">
      <chat-conversation />
    </n-scrollbar>
  </div>
  <div class="footer">
    <div class="chat-btn">
      <div class="left-btn">
        <n-button text>
          <n-icon size="25" :component="EmojiIcon" />
        </n-button>
        <n-button text>
          <n-icon size="25" :component="FileIcon" />
        </n-button>
        <n-button text>
          <n-icon size="25" :component="ChatHisIcon" />
        </n-button>
      </div>
      <div class="right-btn">
        <n-button text>
          <n-icon size="25" :component="CallPhoneIcon" />
        </n-button>
        <n-button text>
          <n-icon size="25" :component="CallVideoIcon" />
        </n-button>
      </div>
    </div>
    <n-input type="textarea" class="chat-area" placeholder=""/>
    <n-button type="primary" class="send-btn" ghost >发送(S)</n-button>
  </div>
</template>

<script setup lang="ts">
import { MoreHorizontal24Regular as MoreIcon, EmojiSparkle24Regular as EmojiIcon, DocumentAdd24Regular as FileIcon, History24Regular as ChatHisIcon,
  SlideMicrophone24Regular as CallPhoneIcon, Video24Regular as CallVideoIcon } from '@vicons/fluent'
import ChatConversation from '@/components/chat/ChatConversation.vue'
</script>

<style scoped>
.header, .footer {
  flex: none;
  background-color: white;
  text-align: center;
  line-height: 50px;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header {
  display: flex;
  height: 8.8%;
  border-bottom: 1px whitesmoke solid;
}

.footer {
  top: auto;
  bottom: 0;
  height: 31.2%;
  border-top: 1px whitesmoke solid;
}

.content {
  flex: 1;
  overflow-y: auto;
  height: 60%;
  padding: 0 0 0 20px;
}

.to-user {
  font-size: 16px;
  cursor: pointer;
  float: left;
  left: 10px;
  width: 90%;
  text-align: left;
  height: 100%;
}

.chat-name-title {
  position: relative;
  top: 8px;
  left: 20px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.more-btn {
  position: relative;
  left: 17px;
  top: 4px;
}

.chat-btn {
  display: flex;
  height: 17%;
  justify-content: space-between;
  padding-left: 15px;
  padding-top: 10px;
}

.left-btn {
  width: 60%;
  flex: 1;
  float: left;
  text-align: left;
}

.left-btn button {
  margin-right: 20px;
}

.right-btn button {
  margin-right: 20px;
}

.chat-area {
  height: 56%;
  text-align: start;
  --n-border: none!important;
  --n-border-hover: none!important;
  --n-border-focus: none!important;
  --n-box-shadow-focus: none!important;
  padding-left: 5px;
}

.send-btn {
  height: 15%;
  float: inline-end;
  right: 24px;
  bottom: 12px;
}

:deep(.n-input.n-input--textarea.n-input--resizable .n-input-wrapper) {
  resize: none;
}
</style>
