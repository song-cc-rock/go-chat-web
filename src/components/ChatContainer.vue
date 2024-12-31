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
      渔王还想 继续做渔王 <br/>
      而海港已经 不知去向 <br/>
      此刻他醉倒 在洗浴中心 <br/>
      没有潮汐的梦 <br/>
      胸口已暮色苍茫 <br/>
      肥胖的城市 递给他一个 <br/>
      传统的方法 来克制恐慌 <br/>
      卖掉武器 风暴喉咙 <br/>
      换取饮食 <br/>
      背叛能让你获得自由 <br/>
      停电之后 暂时摆脱了 <br/>
      坚硬的时刻 倒转的河 <br/>
      肥胖的城市 <br/>
      驱赶着所有 拒绝沉没的人 <br/>
      那首疯狂的歌又响起 <br/>
      电灯熄灭 物换星移 泥牛入海 <br/>
      黑暗好像 一颗巨石 按在胸口 <br/>
      独脚大盗 百万富翁 摸爬滚打 <br/>
      黑暗好像 一颗巨石 按在胸口 <br/>
      电灯熄灭 物换星移 泥牛入海 <br/>
      黑暗好像 一颗巨石 按在胸口 <br/>
      独脚大盗 百万富翁 摸爬滚打 <br/>
      黑暗好像 一颗巨石 按在胸口 <br/>
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
  padding-left: 20px;
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
  bottom: 9px;
}

:deep(.n-input.n-input--textarea.n-input--resizable .n-input-wrapper) {
  resize: none;
}
</style>
