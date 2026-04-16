<script setup lang="ts">
  import { ref, onMounted, useTemplateRef } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { apiResetPassword } from '@/api/front/users';
  import AlertModal from '@/components/AlertModal.vue';
  import { messageStore, loadingStore } from '@/stores/front';
  import type { AppErrorResponse } from '@/types/common';

  const route = useRoute();
  const router = useRouter();
  const loadingRef = loadingStore();
  const messageRef = messageStore();
  const { openLoading, closeLoading } = loadingRef;
  const { pushMessage } = messageRef;
  const errorMsg = ref<string>('');
  const user = ref<{
    token: string;
    password: string;
    confirmPassword: string;
  }>({
    token: '',
    password: '',
    confirmPassword: '',
  });
  const formRef = useTemplateRef<HTMLFormElement>('formRef');
  const alertModalRef = useTemplateRef<InstanceType<typeof AlertModal>>('alertModalRef');

  // 重設密碼
  async function resetPassword() {
    openLoading();

    try {
      await apiResetPassword(user.value);
      alertModalRef.value?.openModal();

      closeLoading();
    } catch (err) {
      pushMessage({
        style: 'danger',
        title: '重設密碼失敗',
        text: '重設密碼失敗，請重新設定',
      });
      errorMsg.value = (err as AppErrorResponse).message || '重設密碼失敗，請重新設定';
      closeLoading();
    }
  }

  // 關閉 modal
  async function closeAlertModal() {
    formRef.value?.resetForm();
    await alertModalRef.value?.hideModal();

    // 跳轉至登入頁
    router.push('/signIn');
  }

  onMounted(() => {
    const { token } = route.query;

    if (!token || typeof token !== 'string') {
      // 跳轉至首頁
      router.push('/');
    } else {
      user.value.token = token;
    }
  });
</script>

<template>
  <section class="d-flex flex-wrap justify-content-center align-items-center my-17">
    <VForm
      class="accountForm bg-white rounded-3 shadow"
      v-slot="{ errors, meta }"
      @submit="resetPassword"
      ref="formRef"
    >
      <h1 class="mb-8 text-center h3">重設您的密碼</h1>
      <p class="mb-11 text-center text-muted lh-lg">請輸入您的新密碼</p>
      <p class="mb-11 py-11 alert alert-danger" v-if="errorMsg">
        <i class="bi bi-exclamation-triangle-fill me-4"></i>
        {{ errorMsg }}
      </p>
      <div class="mb-8">
        <label for="password" class="d-block mb-4">
          <span class="text-danger">*</span>
          新密碼：
        </label>
        <VField
          type="password"
          name="密碼"
          id="password"
          class="form-control"
          :class="{
            'is-invalid': errors['密碼'],
          }"
          placeholder="請輸入密碼"
          rules="password:8|required"
          v-model="user.password"
          required
        />
        <ErrorMessage name="密碼" class="text-danger" />
      </div>
      <div class="mb-16">
        <label for="confirmPassword" class="form-label">
          <span class="text-danger">*</span>
          請再次輸入一次新密碼：
        </label>
        <VField
          type="password"
          name="確認密碼"
          id="confirmPassword"
          class="form-control"
          :class="{
            'is-invalid': errors['確認密碼'],
          }"
          placeholder="請輸入確認密碼"
          rules="confirmed:@密碼"
          v-model="user.confirmPassword"
          required
        />
        <ErrorMessage name="確認密碼" class="text-danger" />
      </div>
      <div class="mb-11 text-center">
        <button
          type="submit"
          aria-disabled="true"
          class="w-75 btn btn-primary"
          :class="{ disabled: !meta.valid }"
          :disabled="!meta.valid"
        >
          重設密碼
        </button>
      </div>
    </VForm>
  </section>

  <AlertModal ref="alertModalRef">
    <template #modal-header>
      <span class="titleIcon bg-secondary text-white">
        <i class="bi bi-bell-fill"></i>
      </span>
      密碼更新成功
    </template>
    <template #modal-content>
      <p>密碼已成功更新</p>
      <p>即將跳轉至登入頁面，請使用新密碼登入！</p>
    </template>
    <template #modal-footer>
      <button type="button" class="w-50 btn btn-primary" @click="closeAlertModal">關閉</button>
    </template>
  </AlertModal>
</template>
