<template>
  <div class="home-container">
    <n-layout class="layout-container" :has-sider="true">
      <n-layout-sider class="sider-container">
        <!-- avatar -->
        <div class="avatar-container">
          <n-popover :show-arrow="false" trigger="click" placement="right">
            <template #trigger>
              <n-badge :value="unReadCount" :max="99" class="my-avatar">
                <n-avatar
                  round
                  size="medium"
                  :src="authUser.avatar"
                />
              </n-badge>
            </template>
            <user-tip-container :current-user="authUser" style="background-color: white!important;"/>
          </n-popover>
        </div>
        <!-- menu -->
        <n-menu :options="menuOptions" :icon-size="30" :default-value="'chat'" @update:value="toMenu" />
        <!-- exit -->
        <div class="quick-container">
          <n-button text class="quick-exit" @click="showExitModal = true">
            <n-icon>
              <PowerIcon />
            </n-icon>
          </n-button>
        </div>
      </n-layout-sider>
      <n-layout class="info-container">
        <n-layout-content>
          <router-view />
        </n-layout-content>
      </n-layout>
    </n-layout>
  </div>

  <n-modal
    v-model:show="showExitModal"
    :mask-closable="false"
    preset="dialog"
    title="退出系统?"
    positive-text="确认"
    negative-text="蒜鸟🤣!"
    @positive-click="exitHome"
    @negative-click="keepChat"
  />
</template>

<script setup lang="ts">
import type { MenuOption } from 'naive-ui'
import { type Component, onMounted } from 'vue'
import { WechatOutlined as ChatIcon, UsergroupAddOutlined as GroupIcon, PoweroffOutlined as PowerIcon} from '@vicons/antd'
import { NIcon, createDiscreteApi } from 'naive-ui'
import { h, ref } from 'vue'
import router from "@/router/index.js";
import { clearAuthUser, getAuthUser } from '@/utils/auth.ts'
import { getUnreadCount } from '@/api/user.ts'
import UserTipContainer from '@/components/UserTipContainer.vue'

const { message } = createDiscreteApi(["message"])
const renderIcon = (icon: Component) => {
  return () => h(NIcon, null, { default: () => h(icon) })
}
const showExitModal = ref<boolean>(false)
const authUser = getAuthUser()
const unReadCount = ref<number>(0)

const menuOptions: MenuOption[] = [
  {
    key: 'chat',
    icon: renderIcon(ChatIcon)
  },
  {
    key: 'contact',
    icon: renderIcon(GroupIcon)
  }
]

const toMenu = (key: string) => {
  router.push(key)
}

const exitHome = () => {
  showExitModal.value = false
  clearAuthUser()
  router.push('/login')
  message.success('已登出！')
}

const keepChat = () => {
  showExitModal.value = false
  message.info('Go Chat😊!')
}

onMounted(async () => {
  if (authUser) {
    unReadCount.value = await getUnreadCount(authUser.id)
  }
})
</script>

<style>
.home-container {
  width: 1000px;
  height: 660px;
  background-size: 100%;
  border-radius: 20px;
  overflow: hidden;
  border: 2px solid #F1F1F1;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  background: transparent;
  position: absolute;
  top: 7%;
}

.layout-container {
  height: 100%;
  width: 100%;
}

.n-layout-scroll-container {
  display: flex;
}

.sider-container {
  width: 10% !important;
  height: 100%;
  display: block;
}

.n-layout-sider-scroll-container {
  min-width: 0!important;
}

.n-menu {
  height: 80%;
  width: 100%;
  background-color: whitesmoke;
}

.n-menu-item-content.n-menu-item-content--selected {
  --n-item-color-active: none;
  --n-item-color-hover: none;
  --n-item-color-active-hover: none;
}

.n-menu-item-content {
  --n-item-color-hover: none;
}

.n-menu .n-menu-item-content .n-menu-item-content__icon:hover {
  color: #36ad6a !important;
}

.n-menu .n-menu-item {
  margin-top: 20px;
}

.avatar-container {
  height: 10%;
  width: 100%;
  background-color: whitesmoke;
}

.n-badge.my-avatar {
  position: relative;
  left: 30px;
  top: 20px;
  cursor: pointer;
}

.quick-container {
  height: 10%;
  width: 100%;
  background-color: whitesmoke;
}

.quick-exit {
  position: relative;
  left: 30px;
  font-size: 30px;
  top: 15px;
}

.info-container {
  width: 90%;
  height: 100%;
}
</style>
