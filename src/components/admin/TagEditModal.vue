<script setup lang="ts">
  import { ref, watch, useTemplateRef } from 'vue';
  import { useModal } from '@/utils/modal';
  import { loadingStore, messageStore } from '@/stores/admin';
  import { getTime } from '@/utils/date';
  import { apiAdminCreateTag, apiAdminUpdateTag } from '@/api/admin/adminTags';
  import type { AppErrorResponse } from '@/types/common';
  import type { AdminTag } from '@/types/admin/adminTag';

  const loadingRef = loadingStore();
  const messageRef = messageStore();
  const { openLoading, closeLoading } = loadingRef;
  const { pushMessage } = messageRef;

  const tagEditModalRef = useTemplateRef<HTMLDivElement>('tagEditModalRef');
  const formRef = useTemplateRef<HTMLFormElement>('formRef');
  const { openModal, hideModal } = useModal(tagEditModalRef);
  const errorMsg = ref<string>('');
  const tag = ref<AdminTag>({
    _id: '',
    title: '',
    createdAt: '',
    updatedAt: '',
  });

  defineExpose({
    openModal,
    hideModal,
  });

  const props = withDefaults(defineProps<{ tempTag: AdminTag }>(), {
    tempTag: () => ({
      _id: '',
      title: '',
      createdAt: '',
      updatedAt: '',
    }),
  });

  const emit = defineEmits(['getTags']);

  // 動態監聽 props
  watch(props, newProps => {
    tag.value = newProps.tempTag;
    errorMsg.value = '';
  });

  // 新增/更新標籤
  async function updateTag() {
    openLoading();
    const { _id, title } = tag.value;
    const msgTitle: string = _id ? '更新' : '新增';

    try {
      if (_id) {
        await apiAdminUpdateTag(_id, { title });
      } else {
        await apiAdminCreateTag({ title });
      }
      formRef.value?.resetForm();

      emit('getTags');
      pushMessage({
        style: 'success',
        title: `${msgTitle}成功`,
        text: `標籤${msgTitle}成功`,
      });
      closeLoading();
      hideModal();
    } catch (err) {
      errorMsg.value = (err as AppErrorResponse).message || `標籤${msgTitle}失敗，請重整網頁`;
      closeLoading();
    }
  }
</script>

<template>
  <div
    class="modal fade"
    id="tagEditModal"
    tabindex="-1"
    aria-labelledby="tagEditModalLabel"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    ref="tagEditModalRef"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content overflow-hidden">
        <VForm
          class="modal-body p-0"
          ref="formRef"
          v-slot="{ errors, meta, resetForm }"
          @submit="updateTag"
        >
          <div class="p-11">
            <h1 class="modal-title title mb-8" id="tagEditModalLabel">
              <span class="titleIcon bg-dark-subtl">
                <i class="bi bi-pencil-fill"></i>
              </span>
              <slot name="modal-header">標題</slot>
            </h1>
            <p class="mb-11 py-11 alert alert-danger" v-if="errorMsg">
              <i class="bi bi-exclamation-triangle-fill me-4"></i>
              {{ errorMsg }}
            </p>
            <div :class="{ 'mb-8': tag.createdAt }">
              <label for="title" class="form-label">
                <span class="text-danger">*</span>
                標籤標題：
              </label>
              <VField
                type="text"
                name="標籤標題"
                id="title"
                class="form-control"
                :class="{
                  'is-invalid': errors['標籤標題'],
                }"
                placeholder="請輸入標籤標題"
                rules="min:1|max:10|required"
                v-model="tag.title"
                required
              />
              <ErrorMessage name="標籤標題" class="invalid-feedback" />
            </div>

            <div v-if="tag.createdAt">
              <p>建立時間：{{ getTime(tag.createdAt) }}</p>
              <p>更新時間：{{ getTime(tag.updatedAt) }}</p>
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
