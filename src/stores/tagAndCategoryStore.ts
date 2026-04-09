import { ref } from 'vue';
import { defineStore } from 'pinia';
import { loadingStore, messageStore } from './index.js';
import { apiGetCategories } from '@/api/front/categories';
import { apiGetTags } from '@/api/front/tags';
import type { Tag } from '@/types/front/tag';
import type { Category } from '@/types/front/category';
import type { AppErrorResponse } from '@/types/common';

export default defineStore('tagAndCategoryStore', () => {
  const loading = loadingStore();
  const message = messageStore();
  const tags = ref<Tag[]>([]);
  const categories = ref<Category[]>([]);

  // 取得分類與標籤
  async function getTagsAndCategories() {
    loading.openLoading();
    try {
      const tagsRes = await apiGetTags();
      const categoriesRes = await apiGetCategories();
      tags.value = tagsRes.data.data;
      categories.value = categoriesRes.data.data;

      loading.closeLoading();
    } catch (err) {
      message.pushMessage({
        style: 'danger',
        title: '取得標籤與分類失敗',
        text: (err as AppErrorResponse).message || '取得標籤與分類失敗，請重整網頁',
      });
      loading.closeLoading();
    }
  }

  return {
    tags,
    categories,
    getTagsAndCategories,
  };
});
