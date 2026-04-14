import { ref } from 'vue';
import { defineStore } from 'pinia';

export default defineStore('loadingStore', () => {
  const isLoading = ref<boolean>(false);
  // 開啟 Loading
  function openLoading() {
    isLoading.value = true;
  }

  // 關閉 Loading
  function closeLoading() {
    isLoading.value = false;
  }
  return {
    isLoading,
    openLoading,
    closeLoading,
  };
});
