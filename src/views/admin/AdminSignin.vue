<script setup lang="ts">
  import { ref, useTemplateRef } from 'vue';
  import { useRouter } from 'vue-router';
  import { apiAdminSignIn } from '@/api/admin/adminUsers';
  import { setToken } from '@/utils/auth';
  import { messageStore, loadingStore } from '@/stores/admin';
  import type { AppErrorResponse } from '@/types/common';

  const router = useRouter();
  const loadingRef = loadingStore();
  const messageRef = messageStore();
  const { openLoading, closeLoading } = loadingRef;
  const { pushMessage } = messageRef;
  const errorMsg = ref<string>('');
  const user = ref<{
    email: string;
    password: string;
  }>({
    email: '',
    password: '',
  });
  const formRef = useTemplateRef<HTMLFormElement>('formRef');

  // 管理員登入
  async function adminSignIn() {
    openLoading();

    try {
      const res = await apiAdminSignIn(user.value);
      const { status, data } = res.data;

      if (status === 'success') {
        // 設定 token
        setToken(data.token);
        // 重置表單
        formRef.value?.resetForm();
        // 顯示訊息
        pushMessage({
          style: 'success',
          title: '登入成功',
          text: '登入成功，將跳轉至管理頁面',
        });
        // 跳轉至後台首頁
        router.push('/dashboard');
      } else {
        pushMessage({
          style: 'danger',
          title: '登入失敗',
          text: '登入失敗，請重新登入',
        });
      }
      closeLoading();
    } catch (err) {
      pushMessage({
        style: 'danger',
        title: '登入失敗',
        text: '登入失敗請，重新登入',
      });
      errorMsg.value = (err as AppErrorResponse).message || '登入失敗，請重新登入';
      closeLoading();
    }
  }
</script>

<template>
  <nav class="text-center text-xl-start">
    <router-link to="/" class="d-inline-block px-md-13 py-8">
      <img src="../../assets/images/logo.svg" alt="logo" width="160" />
    </router-link>
  </nav>

  <section class="d-flex flex-wrap justify-content-center align-items-center mb-17">
    <VForm
      class="accountForm bg-white rounded-3 shadow"
      v-slot="{ errors, meta }"
      @submit="adminSignIn"
      ref="formRef"
    >
      <h1 class="mb-11 text-center h3">管理員介面</h1>
      <p class="mb-15 text-center text-muted lh-lg">
        歡迎來到 燃味廚房管理員介面，
        <span class="d-block"> 請輸入管理員帳號與密碼登入 </span>
      </p>
      <p class="mb-11 py-11 alert alert-danger" v-if="errorMsg">
        <i class="bi bi-exclamation-triangle-fill me-4"></i>
        {{ errorMsg }}
      </p>
      <div class="mb-8">
        <label for="email" class="d-block mb-4">
          <span class="text-danger">*</span>
          電子信箱：
        </label>
        <VField
          type="email"
          name="電子信箱"
          id="email"
          class="form-control"
          :class="{
            'is-invalid': errors['電子信箱'],
          }"
          placeholder="請輸入電子信箱"
          rules="email|required"
          v-model="user.email"
          required
        />
        <ErrorMessage name="電子信箱" class="text-danger" />
      </div>

      <div class="mb-8">
        <label for="password" class="d-block mb-4">
          <span class="text-danger">*</span>
          密碼：
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
          rules="required"
          v-model="user.password"
          required
        />
        <ErrorMessage name="密碼" class="text-danger" />
      </div>
      <p class="mb-13 text-end">
        <router-link to="/forget-password" class="text-decoration-underline">
          忘記密碼？
        </router-link>
      </p>
      <div class="text-center">
        <button
          type="submit"
          aria-disabled="true"
          class="w-75 btn btn-primary"
          :class="{ disabled: !meta.valid }"
          :disabled="!meta.valid"
        >
          立即登入
        </button>
      </div>
    </VForm>
  </section>
</template>

<style lang="scss">
  @import '@/assets/scss/admin.scss';
</style>
