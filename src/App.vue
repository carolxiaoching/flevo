<script setup lang="ts">
  import { RouterView, useRoute } from 'vue-router';
  import { storeToRefs } from 'pinia';
  import { computed } from 'vue';
  import Loading from 'vue-loading-overlay';
  import 'vue-loading-overlay/dist/css/index.css';
  import { loadingStore } from '@/stores/front';
  import Toast from '@/components/ToastComponent.vue';

  const loadingRef = loadingStore();
  const { isLoading } = storeToRefs(loadingRef);

  const route = useRoute();
  const routerKey = computed(() => (route.name === 'user' ? route.fullPath : route.path));
</script>

<template>
  <Loading v-model:active="isLoading" :can-cancel="false" :is-full-page="true" :z-index="1060" />
  <Toast />
  <RouterView :key="routerKey" />
</template>
