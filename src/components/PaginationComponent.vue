<script setup lang="ts">
  import { computed } from 'vue';
  import type { Pagination } from '@/types/common';

  type Props = {
    pagination: Pagination;
  };

  const { pagination } = defineProps<Props>();

  const emit = defineEmits<{
    'update-page': [page: number];
  }>();

  // 計算要顯示的頁碼，最多顯示 3 個（當前頁碼前後各 1 個）
  const visiblePages = computed(() => {
    const { currentPage, totalPage } = pagination;
    // 起始頁碼和結束頁碼
    let start = Math.max(1, currentPage - 1);
    let end = Math.min(totalPage, currentPage + 1);

    // 頁碼範圍不足 3 個時，調整起始頁碼補足至 3 個
    if (end - start < 2) {
      if (start === 1) end = Math.min(totalPage, start + 2);
      else start = Math.max(1, end - 2);
    }
    // 生成頁碼列表
    // _ 當前元素的值，i 是索引
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });
</script>

<template>
  <nav aria-label="Page navigation">
    <ul class="pagination justify-content-center mb-0">
      <li class="page-item" :class="{ disabled: !pagination.hasPrev }">
        <a
          class="page-link rounded-circle"
          href="#"
          aria-label="Previous"
          @click.prevent="emit('update-page', pagination.currentPage - 1)"
          :disabled="!pagination.hasPrev"
        >
          <span>&laquo;</span>
        </a>
      </li>
      <li
        class="page-item mx-1"
        :class="{ active: n === pagination.currentPage }"
        v-for="n in visiblePages"
        :key="n"
      >
        <a class="page-link rounded-circle" href="#" @click.prevent="emit('update-page', n)">
          {{ n }}
        </a>
      </li>
      <li class="page-item" :class="{ disabled: !pagination.hasNext }">
        <a
          class="page-link rounded-circle"
          href="#"
          aria-label="Next"
          :disabled="!pagination.hasNext"
          @click.prevent="emit('update-page', pagination.currentPage + 1)"
        >
          <span>&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
</template>
