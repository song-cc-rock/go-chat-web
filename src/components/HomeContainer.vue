<template>
  <div class="home-container">
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
</style>
