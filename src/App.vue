<template>
  <n-message-provider>
    <RouterView />
  </n-message-provider>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { NMessageProvider } from "naive-ui";
</script>

<style>
@media (min-width: 1024px) {
  #app {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
