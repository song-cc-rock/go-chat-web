<template>
  <n-list v-for="(value, key) in conversationMap" :key="key" class="group-chat" :show-divider="false">
    <div class="last-time-tag"><n-tag size="small">{{getLastConversationTime(value[0])}}</n-tag></div>
    <n-list-item v-for="msg in value[1]" :key="msg.id" :class="msg.sender === 'BobDylan' ? 'box-right' : 'box-left'">
      <template #prefix v-if="msg.sender !== 'BobDylan'">
        <n-avatar
          class="chat-avatar"
          round
          size="medium"
          :src="msg.avatar"
        />
      </template>
      <template #suffix v-if="msg.sender === 'BobDylan'">
        <n-avatar
          class="chat-avatar"
          round
          size="medium"
          :src="msg.avatar"
        />
      </template>
      <n-thing>
        <div class="chat-box">
          <p v-html="msg.content" />
        </div>
      </n-thing>
    </n-list-item>
  </n-list>
</template>

<script setup lang="ts">
import type { Msg } from '@/models/msg.ts'

// key: 上一次对话时间分组, value: 对话内容集合
const conversationMap: Map<Date, Msg[]> = new Map();
conversationMap.set(new Date(), [
  {
    id: '28494141',
    sender: 'Oasis',
    receiver: 'BobDylan',
    type: 'text',
    content: "电灯熄灭, 物换星移, 泥牛入海!",
    time: '2024-12-31 23:59:59',
    avatar: 'https://img1.baidu.com/it/u=4287740108,2208289792&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1067'
  },
  {
    id: '28494142',
    sender: 'BobDylan',
    receiver: 'Oasis',
    type: 'text',
    content: "Don't look back in anger!",
    time: '2024-12-31 23:59:59',
    avatar: 'https://img1.baidu.com/it/u=507077318,2244959797&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667'
  },
  {
    id: '28494141',
    sender: 'Oasis',
    receiver: 'BobDylan',
    type: 'text',
    content: "黑暗好像一颗巨石按在胸口!",
    time: '2024-12-31 23:59:59',
    avatar: 'https://img1.baidu.com/it/u=4287740108,2208289792&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1067'
  },
  {
    id: '28494141',
    sender: 'Oasis',
    receiver: 'BobDylan',
    type: 'text',
    content: "独脚大盗, 百万富翁, 摸爬滚打!",
    time: '2024-12-31 23:59:59',
    avatar: 'https://img1.baidu.com/it/u=4287740108,2208289792&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1067'
  },
  {
    id: '28494141',
    sender: 'Oasis',
    receiver: 'BobDylan',
    type: 'text',
    content: '奋勇呀然后休息呀<br>完成你伟大的人生!',
    time: '2024-12-31 23:59:59',
    avatar: 'https://img1.baidu.com/it/u=4287740108,2208289792&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1067'
  },
  {
    id: '28494142',
    sender: 'BobDylan',
    receiver: 'Oasis',
    type: 'text',
    content: '最新的打印机<br> 复制着彩色傀儡<br> 早上好我的罐头先生<br>让他带你去被工厂敲击!最新的打印机<br> 复制着彩色傀儡<br> 早上好我的罐头先生<br>让他带你去被工厂敲击!最新的打印机<br> 复制着彩色傀儡<br> 早上好我的罐头先生<br>让他带你去被工厂敲击!',
    time: '2024-12-31 23:59:59',
    avatar: 'https://img1.baidu.com/it/u=507077318,2244959797&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667'
  }
]);

const getLastConversationTime = (date: Date) => {
  const hour = date.getHours();
  const minute = date.getMinutes();
  return `${hour}:${minute}`;
}
</script>

<style scoped>
.group-chat {
  padding-top: 10px;
  padding-right: 20px;
}

.chat-box {
  position: relative;
  display: inline-block;
  margin: 0 0 0.5em 0;
  padding: 7px 10px;
  min-width: 120px;
  max-width: 70%;
  color: black;
  font-size: 13px;
  font-weight: 400;
  background: whitesmoke;
  border-radius: 10px;
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

.group-chat .n-list-item {
  padding: 0 0 10px 0;
  width: 100%;
  align-items: flex-start;
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
  left: 98%;
  margin-left: 0;
}

.box-right .chat-box:hover:before {
  border-left: 10px solid #18a058;
}

:deep(.box-right .n-thing-main__content) {
  display: flex;
  justify-content: flex-end;
}

:deep(.box-left .n-list-item__prefix) {
  margin-right: 15px !important;
}

:deep(.box-right .n-list-item__suffix) {
  margin-left: 15px!important;
}
</style>
