<script setup lang="ts">
  import { ref, onMounted, useTemplateRef } from 'vue';
  import { apiAdminGetRecipesPaged, apiAdminDelRecipe } from '@/api/admin/adminRecipes';
  import { apiAdminGetCategories } from '@/api/admin/adminCategories';
  import { apiAdminGetTags } from '@/api/admin/adminTags';
  import { loadingStore, messageStore } from '@/stores/admin';
  import PaginationComponent from '@/components/PaginationComponent.vue';
  import DelModal from '@/components/DelModal.vue';
  import { getCategoryName, getTagName } from '@/utils/dataMap';
  import { getTime } from '@/utils/date';
  import type { AppErrorResponse, Pagination } from '@/types/common';
  import type { AdminRecipe } from '@/types/admin/adminRecipe';
  import type { AdminCategory } from '@/types/admin/adminCategory';
  import type { AdminTag } from '@/types/admin/adminTag';

  const loadingRef = loadingStore();
  const messageRef = messageStore();
  const { openLoading, closeLoading } = loadingRef;
  const { pushMessage } = messageRef;

  const recipes = ref<AdminRecipe[]>([]);
  const categories = ref<AdminCategory[]>([]);
  const tags = ref<AdminTag[]>([]);
  const pagination = ref<Pagination>({
    totalPage: 0,
    currentPage: 0,
    hasPrev: false,
    hasNext: false,
  });
  const delModalRef = useTemplateRef<InstanceType<typeof DelModal>>('delModalRef');
  const delData = ref<{ id: string; title: string }>({
    id: '',
    title: '',
  });

  // 取得所有食譜
  async function getRecipes(page = 1) {
    openLoading();

    try {
      const res = await apiAdminGetRecipesPaged({ page });
      recipes.value = res.data.data.results;
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

  // 取得頁面所需資料
  async function getInitData() {
    try {
      const [tagsResponse, categoriesResponse] = await Promise.all([
        apiAdminGetTags(),
        apiAdminGetCategories(),
      ]);
      tags.value = tagsResponse.data.data;
      categories.value = categoriesResponse.data.data;

      await getRecipes();
    } catch (err) {
      pushMessage({
        style: 'danger',
        title: '載入失敗',
        text: (err as AppErrorResponse).message || '載入失敗，請重整網頁',
      });
    }
  }

  // 刪除食譜
  async function delRecipe(id: string) {
    openLoading();

    try {
      await apiAdminDelRecipe(id);
      await getRecipes();
      pushMessage({
        style: 'success',
        title: '刪除成功',
        text: '刪除成功',
      });
      delModalRef.value?.hideModal();
      closeLoading();
    } catch (err) {
      pushMessage({
        style: 'danger',
        title: '刪除失敗',
        text: (err as AppErrorResponse).message || '刪除失敗，請重整網頁',
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

  onMounted(() => {
    getInitData();
  });
</script>

<template>
  <div class="d-flex justify-content-between align-items-center mb-8">
    <h1 class="h3">食譜管理</h1>
    <router-link to="/dashboard/recipe/new" class="btn btn-primary py-5">
      <i class="bi bi-plus-lg me-8"></i>
      新增食譜
    </router-link>
  </div>

  <div class="table-responsive">
    <table class="table align-middle mb-14">
      <thead>
        <tr class="table-active">
          <th class="d-none d-md-table-cell text-center" width="120">ID 編號</th>
          <th class="text-center">食譜名稱</th>
          <th class="d-none d-md-table-cell text-center" width="120">分類</th>
          <th class="d-none d-xxl-table-cell text-center" width="160">標籤</th>
          <th class="d-none d-xxxl-table-cell text-center" width="80">收藏人數</th>
          <th class="d-none d-lg-table-cell text-center" width="120">發布者</th>
          <th class="d-none d-xxl-table-cell text-center" width="80">公開狀態</th>
          <th class="d-none d-xxl-table-cell text-center" width="80">編輯推薦</th>
          <th class="d-none d-xxxl-table-cell text-center" width="120">建立時間</th>
          <th class="d-none d-xxxl-table-cell text-center" width="120">更新時間</th>
          <th class="text-center" width="160">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in recipes" :key="item._id">
          <td class="d-none d-md-table-cell text-center">#{{ item._id.slice(-5) }}</td>
          <td class="text-center">
            <div class="d-flex align-items-center">
              <img v-lazy="item.coverImgUrl" class="thumbnail me-4" v-if="item.coverImgUrl" />
              <div class="thumbnail me-4" v-else>
                <i class="bi bi-person-fill"></i>
              </div>
              {{ item.title }}
            </div>
          </td>
          <td class="d-none d-md-table-cell text-center">
            {{ getCategoryName(categories, item.category) }}
          </td>
          <td class="d-none d-xxl-table-cell text-center">
            <ul class="d-flex flex-wrap mb-0 list-unstyled">
              <li class="me-4 fs-6" v-for="tagItem in item.tags" :key="tagItem">
                <span class="badge text-bg-secondary text-white">
                  {{ getTagName(tags, tagItem) }}
                </span>
              </li>
            </ul>
          </td>
          <td class="d-none d-xxxl-table-cell text-center">{{ item.collectsCount }}</td>
          <td class="d-none d-lg-table-cell text-center">
            <div class="d-flex flex-column align-items-center">
              <img
                v-lazy="item.user?.avatarImgUrl"
                class="thumbnail me-4 rounded-circle"
                v-if="item.user?.avatarImgUrl"
              />
              <div class="thumbnail me-4 rounded-circle" v-else>
                <i class="bi bi-person-fill"></i>
              </div>
              {{ item.user?.nickName }}
            </div>
          </td>
          <td class="d-none d-xxl-table-cell text-center">
            <span
              class="badge"
              :class="{
                'text-bg-primary text-white': item.isPublic,
                'text-bg-light': !item.isPublic,
              }"
            >
              {{ item.isPublic ? '公開' : '私人' }}
            </span>
          </td>
          <td class="d-none d-xxl-table-cell text-center">
            <span
              class="badge"
              :class="{
                'text-bg-primary text-white': item.isRecommended,
                'text-bg-light': !item.isRecommended,
              }"
            >
              {{ item.isRecommended ? '是' : '否' }}
            </span>
          </td>

          <td class="d-none d-xxxl-table-cell text-center">{{ getTime(item.createdAt) }}</td>
          <td class="d-none d-xxxl-table-cell text-center">{{ getTime(item.updatedAt) }}</td>

          <td class="text-center">
            <div class="btn-group btn-group-sm" role="group">
              <router-link :to="`/dashboard/recipe/${item._id}`" class="btn btn-outline-dark">
                編輯
              </router-link>
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

  <PaginationComponent :pagination="pagination" @update-page="getRecipes" />
  <DelModal ref="delModalRef" :del-id="delData.id" :del-title="delData.title" @del-item="delRecipe">
    <template #modal-header> 刪除食譜 #{{ delData.id.slice(-5) }} </template>
    <template #modal-content>
      <p class="mb-8">
        確定要刪除食譜：
        <strong> {{ delData.title }} </strong>
      </p>
    </template>
  </DelModal>
</template>
