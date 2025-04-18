<template>
  <div class="contact-container">
    <div class="main-info-container">
      <div class="main-info-box">
        <n-avatar
          class="group-member-avatar"
          round
          :size="48"
          :src="props.currentUser.avatar" />
        <div class="text-info">
          <div class="member-name">{{props.currentUser.nickName}}
            <n-icon size="20" class="card-icon">
              <CardIcon />
            </n-icon>
          </div>
          <div class="member-email second-info">邮箱 :<span class="right-text">{{props.currentUser.mail}}</span></div>
          <div class="member-phone second-info">手机 :<span class="right-text">{{props.currentUser.phone}}</span></div>
        </div>
      </div>
    </div>
    <div class="extra-info-container">
      <div class="text-info">
        <div class="member-remark second-info">备注 :
          <span class="remark">只有音乐才是我的解药!</span>
        </div>
        <div class="member-tag second-info">标签 :
          <n-tag type="success" size="small">
            rock
          </n-tag>
          <n-tag type="success" size="small">
            folk
          </n-tag>
        </div>
      </div>
    </div>
  </div>
  <div class="send-user-msg">
    <n-button strong secondary type="tertiary">
      发消息
    </n-button>
  </div>
</template>
<script setup lang="ts">
import {IdcardOutlined as CardIcon} from '@vicons/antd'
import type { AuthUser } from '@/models/user.ts'
const props = defineProps<{
  currentUser: AuthUser;
}>();
</script>
<style scoped>
.contact-container {
  height: 170px;
  width: 260px;
  display: block;
}

.send-user-msg {
  text-align: center;
  --n-text-color: black;
  margin-bottom: 8px;
}

.send-user-msg .n-button {
  --n-text-color: black!important;
  --n-text-color-hover: black!important;
  --n-text-color-pressed: black!important;
  --n-text-color-focus: black!important;
  width: 120px;
}

.main-info-container {
  height: 50%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  border-bottom: 1px solid whitesmoke;
}

.main-info-box {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 5px;
}

.text-info {
  margin: 0 10px 0 25px;
}

.extra-info-container {
  height: 40%;
}

.member-name {
  font-size: 18px;
  color: black;
  font-weight: 500;
}

.main-info-container .second-info {
  font-size: 13px;
}

.second-info {
  margin-top: 2px;
  color: rgb(179, 179, 179);
}

.main-info-container .second-info {
  font-size: 12px;
}

.extra-info-container .second-info {
  font-size: 14px;
  margin-top: 10px;
}

.right-text {
  margin-left: 5px;
}

.card-icon {
  position: relative;
  top: 4px;
  left: 5px;
  color: #0e7a0d
}

.extra-info-container {
  height: 40%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}

.member-tag .n-tag{
  margin-right: 10px;
}

.remark {
  color: black;
}
</style>
