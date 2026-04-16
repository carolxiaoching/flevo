<script setup lang="ts">
  import { ref, onMounted, useTemplateRef } from 'vue';
  import { apiAdminGetImagesPaged, apiAdminDelImage } from '@/api/admin/adminImages';
  import { loadingStore, messageStore } from '@/stores/admin';
  import { getTime } from '@/utils/date';
  import PaginationComponent from '@/components/PaginationComponent.vue';
  import DelModal from '@/components/DelModal.vue';
  import AlertModal from '@/components/AlertModal.vue';
  import type { AppErrorResponse, Pagination } from '@/types/common';
  import type { AdminImageDetail } from '@/types/admin/adminImage';

  type tempImage = {
    id: string;
    type: string;
    imageUrl: string;
    userNickName?: string;
    createdAt: string;
    updatedAt: string;
  };

  const loadingRef = loadingStore();
  const messageRef = messageStore();
  const { openLoading, closeLoading } = loadingRef;
  const { pushMessage } = messageRef;

  const images = ref<AdminImageDetail[]>([]);
  const pagination = ref<Pagination>({
    totalPage: 0,
    currentPage: 0,
    hasPrev: false,
    hasNext: false,
  });
  const imageModalRef = useTemplateRef<InstanceType<typeof AlertModal>>('imageModalRef');
  const delModalRef = useTemplateRef<InstanceType<typeof DelModal>>('delModalRef');
  const delData = ref<{ id: string; title: string; imageUrl: string }>({
    id: '',
    title: '',
    imageUrl: '',
  });
  const tempImage = ref<tempImage>({
    id: '',
    type: 'photo',
    imageUrl: '',
    userNickName: '',
    createdAt: '',
    updatedAt: '',
  });

  // 取得圖片列表（分頁）
  async function getImages(page = 1) {
    openLoading();
    try {
      const res = await apiAdminGetImagesPaged({ page });
      images.value = res.data.data.results;
      pagination.value = res.data.data.pagination;

      closeLoading();
    } catch (err) {
      pushMessage({
        style: 'danger',
        title: '取得圖片列表失敗',
        text: (err as AppErrorResponse).message || '請重整網頁再試一次',
      });
      closeLoading();
    }
  }

  // 刪除圖片
  async function delImage(id: string) {
    openLoading();
    try {
      await apiAdminDelImage(id);
      await getImages();
      delData.value = {
        id: '',
        title: '',
        imageUrl: '',
      };
      pushMessage({
        style: 'success',
        title: '刪除圖片成功',
        text: '您已刪除圖片',
      });
      delModalRef.value?.hideModal();
      closeLoading();
    } catch (err) {
      pushMessage({
        style: 'danger',
        title: '刪除圖片失敗',
        text: (err as AppErrorResponse).message || '圖片刪除失敗，請重整網頁再試一次',
      });
      delModalRef.value?.hideModal();
      closeLoading();
    }
  }

  // 開啟 delModal
  function openDelModal({ id, title, imageUrl }: { id: string; title: string; imageUrl: string }) {
    delData.value = {
      id,
      title,
      imageUrl,
    };
    delModalRef.value?.openModal();
  }

  // 開啟 ImageModal
  function openImageModal(item: AdminImageDetail) {
    tempImage.value = {
      id: item._id,
      type: item.type,
      imageUrl: item.imageUrl,
      userNickName: item.user?.nickName,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
    imageModalRef.value?.openModal();
  }

  // 關閉 ImageModal
  function closeImageModal() {
    tempImage.value = {
      id: '',
      type: 'photo',
      imageUrl: '',
      userNickName: '',
      createdAt: '',
      updatedAt: '',
    };
    imageModalRef.value?.hideModal();
  }

  onMounted(() => {
    getImages();
  });
</script>

<template>
  <h1 class="mb-14 h3">圖片管理</h1>
  <div class="table-responsive">
    <table class="table mb-14 align-middle">
      <thead>
        <tr class="table-active">
          <th class="d-none d-sm-table-cell text-center" width="120">ID 編號</th>
          <th class="d-none d-sm-table-cell text-center" width="120">圖片類型</th>
          <th class="text-center">圖片網址</th>
          <th class="d-none d-xxl-table-cell text-center" width="160">上傳會員</th>
          <th class="d-none d-xxl-table-cell text-center" width="160">建立時間</th>
          <th class="d-none d-xxl-table-cell text-center" width="160">更新時間</th>
          <th class="text-center" width="160">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in images" :key="item._id">
          <td class="d-none d-sm-table-cell text-center">#{{ item._id.slice(-5) }}</td>
          <td class="d-none d-sm-table-cell text-center">{{ item.type }}</td>
          <td class="text-center">
            <div class="d-flex flex-column flex-md-row justify-content-center align-items-center">
              <img v-lazy="item.imageUrl" alt="" class="thumbnail me-md-4" />
              <a :href="item.imageUrl" target="_blank" class="text-decoration-underline">
                開啟圖片
              </a>
            </div>
          </td>
          <td class="d-none d-xxl-table-cell text-center">
            {{ item.user?.nickName ? item.user.nickName : `會員 #${item._id.slice(-5)}` }}
          </td>
          <td class="d-none d-xxl-table-cell text-center">{{ getTime(item.createdAt) }}</td>
          <td class="d-none d-xxl-table-cell text-center">{{ getTime(item.updatedAt) }}</td>

          <td class="text-center">
            <div class="btn-group btn-group-sm" role="group">
              <button type="button" class="btn btn-outline-dark" @click="openImageModal(item)">
                看更多
              </button>
              <button
                type="button"
                class="btn btn-outline-danger"
                @click="
                  openDelModal({
                    id: item._id,
                    title: `圖片 #${item._id.slice(-5)}`,
                    imageUrl: item.imageUrl,
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

  <PaginationComponent :pagination="pagination" @update-page="getImages" />

  <DelModal ref="delModalRef" :del-id="delData.id" :del-title="delData.title" @del-item="delImage">
    <template #modal-header> 刪除圖片 </template>
    <template #modal-content>
      <p class="mb-8">
        確定要刪除 <strong> 圖片：#{{ delData.id.slice(-5) }} </strong>
      </p>
      <img v-lazy="delData.imageUrl" class="img-thumbnail" style="max-height: 12rem" />
    </template>
  </DelModal>

  <AlertModal ref="imageModalRef">
    <template #modal-header> 圖片 #{{ tempImage.id.slice(-5) }} </template>
    <template #modal-content>
      <div class="my-11 text-center">
        <img v-lazy="tempImage.imageUrl" class="img-thumbnail" style="max-height: 20rem" />
      </div>
      <label for="imageUrl" class="form-label">網址連結：</label>
      <input
        type="text"
        id="imageUrl"
        class="form-control mb-8"
        :value="tempImage.imageUrl"
        disabled
      />
      <p>
        上傳會員：
        {{ tempImage.userNickName ? tempImage.userNickName : `會員 #${tempImage.id.slice(-5)}` }}
      </p>
      <p>建立時間：{{ getTime(tempImage.createdAt) }}</p>
      <p>更新時間：{{ getTime(tempImage.updatedAt) }}</p>
    </template>
    <template #modal-footer>
      <button type="button" class="w-50 btn btn-primary" @click="closeImageModal">關閉</button>
    </template>
  </AlertModal>
</template>
