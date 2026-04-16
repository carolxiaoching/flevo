<script setup lang="ts">
  import { ref, onMounted, useTemplateRef } from 'vue';
  import { apiAdminGetUsersPaged, apiAdminDelUser } from '@/api/admin/adminUsers';
  import { loadingStore, messageStore } from '@/stores/admin';
  import { getTime } from '@/utils/date';
  import PaginationComponent from '@/components/PaginationComponent.vue';
  import DelModal from '@/components/DelModal.vue';
  import type { AppErrorResponse, Pagination } from '@/types/common';
  import type { AdminUserDetail } from '@/types/admin/adminUser';

  const loadingRef = loadingStore();
  const messageRef = messageStore();
  const { openLoading, closeLoading } = loadingRef;
  const { pushMessage } = messageRef;

  const users = ref<AdminUserDetail[]>([]);
  const pagination = ref<Pagination>({
    totalPage: 0,
    currentPage: 0,
    hasPrev: false,
    hasNext: false,
  });
  const delModalRef = useTemplateRef<InstanceType<typeof DelModal>>('delModalRef');
  const delData = ref<{
    id: string;
    role: 'member' | 'admin';
    avatarImgUrl: string;
    nickName: string;
  }>({
    id: '',
    role: 'member',
    avatarImgUrl: '',
    nickName: '',
  });

  // 取得所有會員（分頁）
  async function getUsers(page = 1) {
    openLoading();

    try {
      const res = await apiAdminGetUsersPaged({ page });
      users.value = res.data.data.results;
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

  // 刪除會員
  async function delUser(id: string) {
    openLoading();

    try {
      await apiAdminDelUser(id);
      await getUsers();

      delData.value = {
        id: '',
        role: 'member',
        avatarImgUrl: '',
        nickName: '',
      };
      pushMessage({
        style: 'success',
        title: '刪除成功',
        text: '刪除會員成功',
      });
      delModalRef.value?.hideModal();
      closeLoading();
    } catch (err) {
      pushMessage({
        style: 'danger',
        title: '刪除失敗',
        text: (err as AppErrorResponse).message || '刪除會員失敗，請重整網頁',
      });
      closeLoading();
    }
  }

  // 開啟 delModal
  function openDelModal({
    id,
    role,
    avatarImgUrl,
    nickName,
  }: {
    id: string;
    role: 'member' | 'admin';
    avatarImgUrl: string;
    nickName: string;
  }) {
    delData.value = {
      id,
      role,
      avatarImgUrl,
      nickName,
    };

    delModalRef.value?.openModal();
  }

  onMounted(() => {
    getUsers();
  });
</script>

<template>
  <h1 class="mb-14 h3">會員管理</h1>
  <div class="table-responsive">
    <table class="table mb-14 align-middle">
      <thead>
        <tr class="table-active">
          <th class="d-none d-md-table-cell text-center" width="120">ID 編號</th>
          <th class="text-center">會員</th>
          <th class="d-none d-lg-table-cell text-center">電子信箱</th>
          <th class="d-none d-xxl-table-cell text-center" width="120">性別</th>
          <th class="d-none d-sm-table-cell text-center" width="120">身分別</th>
          <th class="d-none d-xxl-table-cell text-center" width="200">建立時間</th>
          <th class="d-none d-xxl-table-cell text-center" width="200">更新時間</th>
          <th class="text-center" width="200">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in users" :key="item._id">
          <td class="d-none d-md-table-cell text-center">#{{ item._id.slice(-5) }}</td>
          <td class="text-center">
            <div class="d-flex justify-content-center align-items-center">
              <img
                v-lazy="item.avatarImgUrl"
                class="thumbnail me-4 rounded-circle"
                v-if="item.avatarImgUrl"
              />
              <div class="thumbnail me-4 rounded-circle" v-else>
                <i class="bi bi-person-fill"></i>
              </div>
              {{ item.nickName }}
            </div>
          </td>
          <td class="d-none d-lg-table-cell text-center">{{ item.email }}</td>
          <td class="d-none d-xxl-table-cell text-center">
            {{ { female: '女生', male: '男生', secret: '秘密' }[item.gender] || '秘密' }}
          </td>
          <td class="d-none d-sm-table-cell text-center">
            <span
              class="badge"
              :class="
                item.role === 'admin'
                  ? 'bg-danger-subtle text-danger'
                  : 'bg-secondary-subtle text-secondary'
              "
            >
              {{ item.role === 'admin' ? '管理員' : '一般會員' }}
            </span>
          </td>
          <td class="d-none d-xxl-table-cell text-center">{{ getTime(item.createdAt) }}</td>
          <td class="d-none d-xxl-table-cell text-center">{{ getTime(item.updatedAt) }}</td>

          <td class="text-center">
            <div class="btn-group btn-group-sm" role="group">
              <router-link :to="`/dashboard/user/${item._id}`" class="btn btn-outline-dark">
                編輯
              </router-link>
              <button
                type="button"
                class="btn btn-outline-danger"
                @click="
                  openDelModal({
                    id: item._id,
                    role: item.role,
                    avatarImgUrl: item.avatarImgUrl,
                    nickName: item.nickName,
                  })
                "
              >
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <PaginationComponent :pagination="pagination" @update-page="getUsers" />
  <DelModal
    ref="delModalRef"
    :del-id="delData.id"
    :del-title="delData.nickName"
    @del-item="delUser"
  >
    <template #modal-header> 刪除{{ delData.role === 'admin' ? '管理員' : '會員' }} </template>
    <template #modal-content>
      <p class="mb-8">
        確定要刪除
        <strong>
          {{ delData.role === 'admin' ? '管理員' : '會員' }}：#{{ delData.id.slice(-5) }}
        </strong>
      </p>
      <div class="d-flex align-items-center">
        <img
          v-lazy="delData.avatarImgUrl"
          class="thumbnail me-4 rounded-circle"
          v-if="delData.avatarImgUrl"
        />
        <strong>
          {{ delData.nickName }}
        </strong>
      </div>
    </template>
  </DelModal>
</template>
