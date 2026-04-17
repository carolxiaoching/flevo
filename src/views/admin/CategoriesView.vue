<script setup lang="ts">
  import { ref, onMounted, useTemplateRef } from 'vue';
  import { apiAdminGetCategoriesPaged, apiAdminDelCategory } from '@/api/admin/adminCategories';
  import { loadingStore, messageStore } from '@/stores/admin';
  import { getTime } from '@/utils/date';
  import PaginationComponent from '@/components/PaginationComponent.vue';
  import DelModal from '@/components/DelModal.vue';
  import CategoryEditModal from '@/components/admin/CategoryEditModal.vue';
  import type { AppErrorResponse, Pagination } from '@/types/common';
  import type { AdminCategory } from '@/types/admin/adminCategory';

  const loadingRef = loadingStore();
  const messageRef = messageStore();
  const { openLoading, closeLoading } = loadingRef;
  const { pushMessage } = messageRef;

  const categories = ref<AdminCategory[]>([]);
  const pagination = ref<Pagination>({
    totalPage: 0,
    currentPage: 0,
    hasPrev: false,
    hasNext: false,
  });
  const categoryEditModalRef =
    useTemplateRef<InstanceType<typeof CategoryEditModal>>('categoryEditModalRef');
  const delModalRef = useTemplateRef<InstanceType<typeof DelModal>>('delModalRef');

  const delData = ref<{ id: string; title: string }>({
    id: '',
    title: '',
  });
  const tempCategory = ref<AdminCategory>({
    _id: '',
    title: '',
    categoryImgUrl: '',
    createdAt: '',
    updatedAt: '',
  });

  // 取得所有分類
  async function getCategories(page = 1) {
    openLoading();

    try {
      const res = await apiAdminGetCategoriesPaged({ page });
      categories.value = res.data.data.results;
      pagination.value = res.data.data.pagination;
      closeLoading();
    } catch (err) {
      pushMessage({
        style: 'danger',
        title: '載入失敗',
        text: (err as AppErrorResponse).message || '載入失敗，請重整網頁',
      });
      closeLoading();
    }
  }

  // 刪除分類
  async function delCategory(id: string) {
    openLoading();

    try {
      await apiAdminDelCategory(id);
      pushMessage({
        style: 'success',
        title: '刪除成功',
        text: '分類刪除成功',
      });
      getCategories();
      delModalRef.value?.hideModal();
      closeLoading();
    } catch (err) {
      pushMessage({
        style: 'danger',
        title: '刪除失敗',
        text: (err as AppErrorResponse).message || '分類刪除失敗，請重整網頁',
      });
      closeLoading();
    }
  }

  // 開啟 delModal
  function openDelModal({ id, title }: { id: string; title: string }) {
    delData.value = {
      id,
      title,
    };

    delModalRef.value?.openModal();
  }

  // 開啟 categoryEditModal
  function openCategoryEditModal(action: 'create' | 'edit', item?: AdminCategory) {
    if (action === 'create') {
      tempCategory.value = {
        _id: '',
        title: '',
        categoryImgUrl: '',
        createdAt: '',
        updatedAt: '',
      };
    } else if (item) {
      tempCategory.value = {
        _id: item._id,
        title: item.title,
        categoryImgUrl: item.categoryImgUrl,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    }
    categoryEditModalRef.value?.openModal();
  }

  onMounted(() => {
    getCategories();
  });
</script>

<template>
  <div class="d-flex justify-content-between align-items-center mb-8">
    <h1 class="h3">分類管理</h1>
    <button type="button" class="btn btn-primary py-5" @click="openCategoryEditModal('create')">
      <i class="bi bi-plus-lg me-8"></i>
      新增分類
    </button>
  </div>

  <div class="table-responsive">
    <table class="table mb-14 align-middle">
      <thead>
        <tr class="table-active">
          <th class="d-none d-sm-table-cell text-center" width="120">ID 編號</th>
          <th class="text-center">分類名稱</th>
          <th class="d-none d-xxl-table-cell text-center" width="200">建立時間</th>
          <th class="d-none d-xxl-table-cell text-center" width="200">更新時間</th>
          <th class="text-center" width="200">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in categories" :key="item._id">
          <td class="d-none d-sm-table-cell text-center">#{{ item._id.slice(-5) }}</td>
          <td class="d-flex flex-column flex-md-row justify-content-center align-items-center">
            <img v-lazy="item.categoryImgUrl" class="thumbnail me-4" />
            {{ item.title }}
          </td>
          <td class="d-none d-xxl-table-cell text-center">{{ getTime(item.createdAt) }}</td>
          <td class="d-none d-xxl-table-cell text-center">{{ getTime(item.updatedAt) }}</td>
          <td class="text-center">
            <div class="btn-group btn-group-sm" role="group">
              <button
                type="button"
                class="btn btn-outline-dark"
                @click="openCategoryEditModal('edit', item)"
              >
                編輯
              </button>
              <button
                type="button"
                class="btn btn-outline-danger"
                @click="openDelModal({ id: item._id, title: item.title })"
              >
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <PaginationComponent :pagination="pagination" @update-page="getCategories" />
  <DelModal
    ref="delModalRef"
    :del-id="delData.id"
    :del-title="delData.title"
    @del-item="delCategory"
  >
    <template #modal-header> 刪除分類 </template>
    <template #modal-content>
      確定要刪除 <strong> 分類： {{ delData.title }} </strong>
    </template>
  </DelModal>
  <CategoryEditModal
    ref="categoryEditModalRef"
    :temp-category="tempCategory"
    @get-categories="getCategories"
  >
    <template #modal-header> {{ tempCategory._id ? '編輯分類' : '新增分類' }} </template>
  </CategoryEditModal>
</template>
