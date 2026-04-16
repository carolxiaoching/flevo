<script setup lang="ts">
  import { ref, useTemplateRef } from 'vue';
  import { useRouter } from 'vue-router';
  import { apiSignUp } from '@/api/front/users';
  import { setToken } from '@/utils/auth';
  import { messageStore, loadingStore } from '@/stores/front';
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
    confirmPassword: string;
    nickName: string;
  }>({
    email: '',
    password: '',
    confirmPassword: '',
    nickName: '',
  });
  const formRef = useTemplateRef<HTMLFormElement>('formRef');

  // 註冊
  async function signUp() {
    openLoading();
    try {
      const res = await apiSignUp(user.value);
      const { data } = res.data;
      // 設定 token
      setToken(data.token);
      // 重置表單
      formRef.value?.resetForm();
      // 顯示訊息
      pushMessage({
        style: 'success',
        title: '註冊成功',
        text: '註冊成功，將跳轉至首頁',
      });
      // 跳轉至首頁
      router.push('/');
      closeLoading();
    } catch (err) {
      pushMessage({
        style: 'danger',
        title: '註冊失敗',
        text: '註冊失敗請，重新註冊',
      });
      errorMsg.value = (err as AppErrorResponse).message || '註冊失敗，請重新註冊';
      closeLoading();
    }
  }
</script>

<template>
  <section class="d-flex flex-wrap justify-content-center align-items-center my-17">
    <VForm
      class="accountForm bg-white rounded-3 shadow"
      v-slot="{ errors, meta }"
      @submit="signUp"
      ref="formRef"
    >
      <h1 class="mb-11 text-center h3">註冊</h1>
      <p class="mb-11 text-center text-muted lh-lg">
        歡迎來到我的燃味廚房
        <span class="d-block"> 一起來加入屬於我們食譜的旅程吧！ </span>
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
        <label for="nickName" class="block mb-4">
          <span class="text-danger">*</span>
          暱稱：
        </label>
        <VField
          type="text"
          name="暱稱"
          id="nickName"
          class="form-control"
          :class="{
            'is-invalid': errors['暱稱'],
          }"
          placeholder="請輸入暱稱"
          rules="min:2|max:10|required"
          v-model="user.nickName"
          required
        />
        <ErrorMessage name="暱稱" class="text-danger" />
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
          rules="password:8|required"
          v-model="user.password"
          required
        />
        <ErrorMessage name="密碼" class="text-danger" />
      </div>

      <div class="mb-16">
        <label for="confirmPassword" class="d-block mb-4">
          <span class="text-danger">*</span>
          確認密碼：
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
          立即登入
        </button>
      </div>
      <router-link to="/signIn" class="d-block text-end text-decoration-underline">
        已經有帳號了？立即登入
      </router-link>
    </VForm>
  </section>
</template>
