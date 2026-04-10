<script setup lang="ts">
  import { messageStore } from '@/stores';
  import { storeToRefs } from 'pinia';

  const messageRef = messageStore();
  const { messages } = storeToRefs(messageRef);
  const { clearToast } = messageRef;
</script>

<template>
  <div aria-live="polite" aria-atomic="true" class="position-relative overflow-hidden">
    <div class="toastContainer mt-8 p-2 z-999">
      <div
        class="toast show"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        ref="toast"
        v-for="(msg, key) in messages"
        :key="key"
      >
        <div class="toast-body d-flex" :class="`text-${msg.style}`">
          <span class="d-inline-block me-6">
            <i class="bi bi-x-circle" v-if="msg.style == 'danger'"></i>
            <i class="bi bi-exclamation-triangle" v-else-if="msg.style == 'warning'"></i>
            <i class="bi bi-check-circle" v-else></i>
          </span>
          <div class="me-auto">
            <p class="mb-4">
              <strong class="">
                {{ msg.title }}
              </strong>
            </p>
            <p class="text-muted">
              {{ msg.text }}
            </p>
          </div>

          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="toast"
            aria-label="Close"
            @click="clearToast(key)"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>
