<script setup lang="ts">
  import { ref } from 'vue';
  import { apiCreateImage } from '@/api/front/images';
  import { messageStore, loadingStore } from '@/stores/front';
  import type { AppErrorResponse } from '@/types/common';

  const loadingRef = loadingStore();
  const messageRef = messageStore();
  const { openLoading, closeLoading } = loadingRef;
  const { pushMessage } = messageRef;

  type Props = {
    tempImageUrl: string;
    imageType: string;
  };

  const props = withDefaults(defineProps<Props>(), {
    tempImageUrl: () => '',
    imageType: () => 'avatar',
  });

  const emit = defineEmits<{
    updateImage: [imageUrl: string];
  }>();

  const uploadFile = ref<File | null>(null);
  const isPreview = ref<boolean>(false);
  const previewImageUrl = ref<string>('');

  // 更換並瀏覽圖片
  function changeImage(event: Event) {
    const image = (event.target as HTMLInputElement).files?.[0];

    if (image) {
      uploadFile.value = image;
      const url = window.URL.createObjectURL(image);
      isPreview.value = true;
      previewImageUrl.value = url;
    }
  }

  // 重置圖片
  function resetImage() {
    // 釋放 URL 物件
    window.URL.revokeObjectURL(previewImageUrl.value);
    // 重置狀態
    uploadFile.value = null;
    previewImageUrl.value = '';
    isPreview.value = false;
  }

  // 上傳圖片
  async function uploadImage() {
    if (!uploadFile.value) return;
    const formData = new FormData();
    formData.append('image', uploadFile.value);

    openLoading();

    try {
      const res = await apiCreateImage(formData, props.imageType);
      const { status, data } = res.data;

      if (status === 'success') {
        emit('updateImage', data.imageUrl);
      } else {
        pushMessage({
          style: 'danger',
          title: '上傳失敗',
          text: '上傳失敗，請重整網頁',
        });
      }
      resetImage();
      closeLoading();
    } catch (err) {
      pushMessage({
        style: 'danger',
        title: '上傳失敗',
        text: (err as AppErrorResponse).message || '上傳失敗，請重整網頁',
      });
      closeLoading();
    }
  }
</script>

<template>
  <input
    type="file"
    accept="image/*"
    id="image"
    name="image"
    class="d-none"
    @change="changeImage"
  />

  <div v-if="isPreview">
    <div class="position-relative mb-11 mb-xl-17 border rounded-3">
      <a
        href="#"
        class="previewResetBtn position-absolute top-0 right-0 px-2 text-white fs-2"
        @click.prevent="resetImage()"
      >
        <i class="bi bi-x"></i>
      </a>
      <div
        class="previewImage backgroundCover rounded-3"
        :style="{ backgroundImage: `url(${previewImageUrl})` }"
      ></div>
    </div>

    <div class="text-center">
      <button type="button" class="btn btn-primary w-75" @click.prevent="uploadImage">
        確認更新
      </button>
    </div>
  </div>

  <div v-else>
    <label for="image" class="w-100 mb-11 mb-xl-17 border rounded-3 overflow-hidden">
      <span
        class="uploadLabelImage backgroundCover cursorPointer d-block bg-light"
        :style="{ backgroundImage: `url(${tempImageUrl})` }"
        v-if="tempImageUrl"
      ></span>
      <span
        class="uploadLabelBtn cursorPointer d-flex flex-column justify-content-center align-items-center fs-5"
        v-else
      >
        <i class="bi bi-cloud-arrow-up d-block display-3"></i>
        點擊上傳{{ imageType === 'avatar' ? '頭像' : '圖片' }}
      </span>
    </label>

    <label for="image" class="d-block text-center">
      <span class="btn btn-primary w-75">
        {{ imageType === 'avatar' ? '更新頭像' : '更新圖片' }}
      </span>
    </label>
  </div>
</template>
