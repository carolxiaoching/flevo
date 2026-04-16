<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { useModal } from '@/utils/modal.js';

  type Props = {
    delId: string;
    delTitle: string;
  };

  const delModalRef = useTemplateRef<HTMLDivElement>('delModalRef');
  const { openModal, hideModal } = useModal(delModalRef);

  defineExpose({
    openModal,
    hideModal,
  });

  withDefaults(defineProps<Props>(), {
    delId: () => '',
    delTitle: () => '',
  });

  const emit = defineEmits<{
    'del-item': [delId: string];
  }>();
</script>

<template>
  <div
    class="modal fade"
    id="delModal"
    tabindex="-1"
    aria-labelledby="delModalLabel"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    ref="delModalRef"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content overflow-hidden">
        <div class="modal-body p-0">
          <div class="d-flex p-11">
            <span class="titleIcon bg-danger-subtle text-danger">
              <i class="bi bi-x-lg"></i>
            </span>
            <div class="flex-fill">
              <h1 class="modal-title mb-8 h4" id="delModalLabel">
                <slot name="modal-header">刪除 {{ delTitle }}</slot>
              </h1>
              <div class="mb-8">
                <slot name="modal-content">內容</slot>
              </div>
              <p class="text-muted">注意：刪除後無法復原</p>
            </div>
          </div>
          <div class="d-flex justify-content-end px-11 py-8 bg-light">
            <button
              type="button"
              class="btn btn-sm btn-outline-primary me-8"
              data-bs-dismiss="modal"
            >
              關閉
            </button>
            <button
              type="button"
              class="btn btn-sm btn-outline-danger"
              @click="emit('del-item', delId)"
            >
              確定刪除
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
