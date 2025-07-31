<template>
  <div>登录中，请稍候...</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { RouteEnum } from '@/enums/routeEnums.js'
import { createDiscreteApi} from 'naive-ui'
import { getUserProfile } from '@/api/user.ts'
import { setAuthUser } from '@/utils/auth.ts'

const router = useRouter()
const { message } = createDiscreteApi(["message"])

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const token = urlParams.get("token")

  if (token) {
    localStorage.setItem("token", token)
    window.history.replaceState({}, document.title, "/auth-success")
    // 新增：获取用户信息
    const user = await getUserProfile();
    if (user) {
      setAuthUser(user);
    }
    router.push({ name: RouteEnum.HOME });
    message.success('登录成功!')
  } else {
    router.push('/login')
  }
})
</script>
