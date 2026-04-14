<script setup lang="ts">
  import { ref, useTemplateRef } from 'vue';
  import { useRouter } from 'vue-router';
  import { apiForgetPassword } from '@/api/front/users';
  import AlertModal from '@/components/AlertModal.vue';
  import { messageStore, loadingStore } from '@/stores';
  import type { AppErrorResponse } from '@/types/common';

  const router = useRouter();
  const loadingRef = loadingStore();
  const messageRef = messageStore();
  const { openLoading, closeLoading } = loadingRef;
  const { pushMessage } = messageRef;
  const errorMsg = ref<string>('');
  const user = ref<{ email: string }>({
    email: '',
  });
  const formRef = useTemplateRef<HTMLFormElement>('formRef');
  const alertModalRef = useTemplateRef<InstanceType<typeof AlertModal>>('alertModalRef');

  // 傳送重設密碼 Email
  async function sendResetPasswordEmail() {
    openLoading();

    try {
      await apiForgetPassword(user.value);
      alertModalRef.value?.openModal();

      closeLoading();
    } catch (err) {
      pushMessage({
        style: 'danger',
        title: '信件傳送失敗',
        text: '信件傳送失敗，請重新輸入您註冊的電子信箱',
      });
      errorMsg.value =
        (err as AppErrorResponse).message || '信件傳送失敗，請重新輸入您註冊的電子信箱';
      closeLoading();
    }
  }

  // 關閉 modal
  function closeAlertModal() {
    formRef.value?.resetForm();
    alertModalRef.value?.hideModal();

    // 跳轉至首頁
    router.push('/');
  }
</script>

<template>
  <section class="d-flex flex-wrap justify-content-center aling-items-center my-17">
    <VForm
      class="accountForm bg-white rounded-3 shadow"
      v-slot="{ errors, meta }"
      @submit="sendResetPasswordEmail"
      ref="formRef"
    >
      <h1 class="mb-8 text-center h3">忘記密碼</h1>
      <p class="mb-14 text-center text-muted lh-lg">
        若您忘記密碼
        <span class="d-block">請輸入您註冊時輸入的電子信箱</span>
      </p>
      <p class="mb-11 py-11 alert alert-danger" v-if="errorMsg">
        <i class="bi bi-exclamation-triangle-fill me-4"></i>
        {{ errorMsg }}
      </p>
      <div class="mb-16">
        <label for="email" class="d-block mb-4">
          <span class="text-danger">*</span>
          註冊的電子信箱：
        </label>
        <VField
          type="email"
          name="電子信箱"
          id="email"
          class="form-control"
          :class="{
            'is-invalid': errors['電子信箱'],
          }"
          placeholder="請輸入您註冊的電子信箱"
          rules="email|required"
          v-model="user.email"
          required
        />
        <ErrorMessage name="電子信箱" class="text-danger" />
      </div>
      <div class="mb-11 text-center">
        <button
          type="submit"
          aria-disabled="true"
          class="w-75 btn btn-primary"
          :class="{ disabled: !meta.valid }"
          :disabled="!meta.valid"
        >
          發送重設密碼連結
        </button>
      </div>
      <router-link to="/signUp" class="d-block text-end text-decoration-underline">
        還未註冊會員？立即註冊
      </router-link>
    </VForm>
  </section>

  <AlertModal ref="alertModalRef">
    <template #modal-header>
      <span class="titleIcon bg-secondary text-white">
        <i class="bi bi-bell-fill"></i>
      </span>
      密碼重設信件已發送
    </template>
    <template #modal-content>
      <p>密碼重設連結已發送，請檢查您的電子郵件！</p>
      <p class="mb-8">（可能需要幾分鐘）</p>
      <p>若未收到信件，請查看垃圾郵件夾</p>
      <p>關閉後將跳轉至首頁</p>
    </template>
    <template #modal-footer>
      <button type="button" class="w-50 btn btn-primary" @click="closeAlertModal">關閉</button>
    </template>
  </AlertModal>
</template>
