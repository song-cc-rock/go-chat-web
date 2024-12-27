<template>
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<style>
@media (min-width: 1024px) {
  #app {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 770px;
  }
}
</style>
