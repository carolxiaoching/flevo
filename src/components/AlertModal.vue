<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { useModal } from '@/utils/modal';

  const alertModalRef = useTemplateRef<HTMLDivElement>('alertModalRef');
  const { openModal, hideModal } = useModal(alertModalRef);

  defineExpose({
    openModal,
    hideModal,
  });
</script>

<template>
  <div
    class="modal fade"
    id="alertModal"
    tabindex="-1"
    aria-labelledby="alertModalLabel"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    ref="alertModalRef"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content overflow-hidden">
        <div class="modal-body p-0">
          <div class="p-16 text-center">
            <h1 class="modal-title title mb-11" id="alertModalLabel">
              <slot name="modal-header">標題</slot>
            </h1>
            <slot name="modal-content">內容</slot>
          </div>
          <div class="px-11 py-8 bg-light text-center">
            <slot name="modal-footer">按鈕</slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
