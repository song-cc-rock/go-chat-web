<template>
  <HomeContainer />
</template>

<script setup lang="ts">
import HomeContainer from "@/components/HomeContainer.vue";
import { onMounted, ref } from 'vue'
import {getUserProfile} from '@/api/user.ts'
import type { AuthUser } from '@/models/user.ts'
import { setAuthUser } from '@/utils/auth.ts'

const authUser = ref<AuthUser | null>(null)

onMounted(async () => {
  authUser.value = await getUserProfile()
  setAuthUser(authUser.value)
})
</script>
