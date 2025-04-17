<template>
  <div>登录中，请稍候...</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { RouteEnum } from '@/enums/routeEnums.js'
import { createDiscreteApi} from 'naive-ui'

const router = useRouter()
const { message } = createDiscreteApi(["message"])

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search)
  const token = urlParams.get("token")

  if (token) {
    localStorage.setItem("token", token)
    window.history.replaceState({}, document.title, "/auth-success")
    router.push({ name: RouteEnum.HOME });
    message.success('登录成功!')
  } else {
    router.push('/login')
  }
})
</script>
