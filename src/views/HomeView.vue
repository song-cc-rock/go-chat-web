<template>
  <HomeContainer />
</template>

<script setup lang="ts">
import HomeContainer from "@/components/HomeContainer.vue";
import { onMounted, ref } from 'vue'
import {getUserProfile} from '@/api/user.ts'
import type { AuthUser } from '@/models/user.ts'
import { setAuthUser } from '@/utils/auth.ts'
import router from '@/router'
import { createDiscreteApi } from 'naive-ui'

const { message } = createDiscreteApi(["message"])
const authUser = ref<AuthUser>()

onMounted(async () => {
  authUser.value = await getUserProfile()
  if (!authUser.value) {
    message.error('用户信息已失效，请重新登录！')
    router.push('/login')
  }
  setAuthUser(authUser.value)
})
</script>
