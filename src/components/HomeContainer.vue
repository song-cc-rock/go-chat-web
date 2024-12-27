<template>
  <div class="home-container">
    <!-- avatar -->
    <n-space align="flex-end" class="avatar-container">
      <n-badge value="999+" class="my-avatar">
        <n-avatar
          round
          size="medium"
          src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2F594048bb-3a81-4d16-95c0-d0d2f7e78af9%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1737874445&t=93b89b7698d017646d56dd8748736e3f"
        />
      </n-badge>
    </n-space>
    <!-- menu -->
    <n-menu :options="menuOptions" :icon-size="30" />
  </div>
</template>

<script lang="ts">
import type { MenuOption } from 'naive-ui'
import type { Component } from 'vue'
import { WechatOutlined as ChatIcon, UsergroupAddOutlined as GroupIcon, PoweroffOutlined as PowerIcon} from '@vicons/antd'
import { NIcon } from 'naive-ui'
import { defineComponent, h } from 'vue'

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions: MenuOption[] = [
  {
    key: 'chat',
    icon: renderIcon(ChatIcon)
  },
  {
    key: 'group',
    icon: renderIcon(GroupIcon)
  },
  {
    key: 'power',
    icon: renderIcon(PowerIcon)
  }
]

export default defineComponent({
  setup() {
    return {
      menuOptions
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

.n-menu {
  height: 100%;
  width: 10%;
  background-color: whitesmoke;
}

.n-menu-item-content.n-menu-item-content--selected {
  --n-item-color-active: none;
  --n-item-color-hover: none;
  --n-item-color-active-hover: none;
}

.n-menu .n-menu-item {
  margin-top: 20px;
}

.avatar-container {
  height: 10%;
  width: 10%;
  background-color: whitesmoke;
}

.n-badge.my-avatar {
  position: relative;
  left: 30px;
  bottom: 8px;
}
</style>
