<template>
  <div class="home-container">
    <n-layout class="layout-container">
      <n-layout-sider class="sider-container">
        <!-- avatar -->
        <div class="avatar-container">
          <n-badge value="999+" class="my-avatar">
            <n-avatar
              round
              size="medium"
              src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2F594048bb-3a81-4d16-95c0-d0d2f7e78af9%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1737874445&t=93b89b7698d017646d56dd8748736e3f"
            />
          </n-badge>
        </div>
        <!-- menu -->
        <n-menu :options="menuOptions" :icon-size="30" :default-value="'chat'" @update:value="toMenu" />
        <!-- exit -->
        <div class="quick-container">
          <n-button text class="quick-exit">
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
</template>

<script lang="ts">
import type { MenuOption } from 'naive-ui'
import type { Component } from 'vue'
import { WechatOutlined as ChatIcon, UsergroupAddOutlined as GroupIcon, PoweroffOutlined as PowerIcon} from '@vicons/antd'
import { NIcon } from 'naive-ui'
import { defineComponent, h } from 'vue'
import router from "@/router/index.js";

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

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

export default defineComponent({
  components: {
    PowerIcon
  },
  setup() {
    return {
      menuOptions,
      toMenu(key: string) {
        router.push(key)
      }
    }
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
