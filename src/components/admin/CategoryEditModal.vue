<script setup lang="ts">
  import { ref, watch, useTemplateRef } from 'vue';
  import { useModal } from '@/utils/modal';
  import { loadingStore, messageStore } from '@/stores/admin';
  import { getTime } from '@/utils/date';
  import { apiAdminCreateCategory, apiAdminUpdateCategory } from '@/api/admin/adminCategories';
  import UploadComponent from '@/components/UploadComponent.vue';
  import type { AppErrorResponse } from '@/types/common';
  import type { AdminCategory } from '@/types/admin/adminCategory';

  const loadingRef = loadingStore();
  const messageRef = messageStore();
  const { openLoading, closeLoading } = loadingRef;
  const { pushMessage } = messageRef;

  const categoryEditModalRef = useTemplateRef<HTMLDivElement>('categoryEditModalRef');
  const formRef = useTemplateRef<HTMLFormElement>('formRef');
  const { openModal, hideModal } = useModal(categoryEditModalRef);
  const errorMsg = ref<string>('');
  const category = ref<AdminCategory>({
    _id: '',
    title: '',
    categoryImgUrl: '',
    createdAt: '',
    updatedAt: '',
  });

  defineExpose({
    openModal,
    hideModal,
  });

  const props = withDefaults(defineProps<{ tempCategory: AdminCategory }>(), {
    tempCategory: () => ({
      _id: '',
      title: '',
      categoryImgUrl: '',
      createdAt: '',
      updatedAt: '',
    }),
  });
  const emit = defineEmits(['getCategories']);

  // 動態監聽 props
  watch(props, newProps => {
    category.value = newProps.tempCategory;
    errorMsg.value = '';
  });

  // 新增/更新分類
  async function updateCategory() {
    openLoading();
    const { _id, title, categoryImgUrl } = category.value;
    const msgTitle: string = _id ? '更新' : '新增';

    try {
      if (_id) {
        await apiAdminUpdateCategory(_id, { title, categoryImgUrl });
      } else {
        await apiAdminCreateCategory({ title, categoryImgUrl });
      }
      formRef.value?.resetForm();

      emit('getCategories');
      pushMessage({
        style: 'success',
        title: `${msgTitle}成功`,
        text: `分類${msgTitle}成功`,
      });
      closeLoading();
      hideModal();
    } catch (err) {
      errorMsg.value = (err as AppErrorResponse).message || `分類${msgTitle}失敗，請重整網頁`;
      closeLoading();
    }
  }

  // 更新圖片
  function uploadImage(imageUrl: string) {
    category.value.categoryImgUrl = imageUrl;
  }
</script>

<template>
  <div
    class="modal fade"
    id="categoryEditModal"
    tabindex="-1"
    aria-labelledby="categoryEditModalLabel"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    ref="categoryEditModalRef"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content overflow-hidden">
        <VForm
          class="modal-body p-0"
          ref="formRef"
          v-slot="{ errors, meta, resetForm }"
          @submit="updateCategory"
        >
          <div class="p-11">
            <h1 class="modal-title title mb-8" id="categoryEditModalLabel">
              <span class="titleIcon bg-dark-subtl">
                <i class="bi bi-pencil-fill"></i>
              </span>
              <slot name="modal-header">標題</slot>
            </h1>
            <p class="mb-11 py-11 alert alert-danger" v-if="errorMsg">
              <i class="bi bi-exclamation-triangle-fill me-4"></i>
              {{ errorMsg }}
            </p>
            <div class="mb-8">
              <label for="title" class="form-label">
                <span class="text-danger">*</span>
                分類標題：
              </label>
              <VField
                type="text"
                name="分類標題"
                id="title"
                class="form-control"
                :class="{
                  'is-invalid': errors['分類標題'],
                }"
                placeholder="請輸入分類標題"
                rules="min:1|max:10|required"
                v-model="category.title"
                required
              />
              <ErrorMessage name="分類標題" class="invalid-feedback" />
            </div>
            <div :class="[category.createdAt ? 'mb-16' : 'mb-8']">
              <label for="coverImgUrl" class="form-label">
                <span class="text-danger">*</span>
                分類圖片
              </label>
              <VField
                type="text"
                id="coverImgUrl"
                class="d-none"
                name="分類圖片"
                v-model="category.categoryImgUrl"
                rules="required"
                required
              />
              <ErrorMessage name="分類圖片" v-slot="{ message }">
                <p class="mb-4 text-center text-danger">{{ message }}</p>
              </ErrorMessage>
              <div class="flex-fill mx-lg-16">
                <UploadComponent
                  :temp-image-url="category.categoryImgUrl"
                  imageType="icon"
                  @update-image="uploadImage"
                />
              </div>
            </div>

            <div v-if="category.createdAt">
              <p>建立時間：{{ getTime(category.createdAt) }}</p>
              <p>更新時間：{{ getTime(category.updatedAt) }}</p>
            </div>
          </div>

          <div class="d-flex px-11 py-8 bg-light">
            <button
              type="button"
              class="w-50 btn btn-outline-primary me-8"
              data-bs-dismiss="modal"
              @click="resetForm"
            >
              取消
            </button>
            <button
              type="submit"
              aria-disabled="true"
              class="w-50 btn btn-primary"
              :class="{ disabled: !meta.valid }"
              :disabled="!meta.valid"
            >
              確定送出
            </button>
          </div>
        </VForm>
      </div>
    </div>
  </div>
</template>
