<script setup lang="ts">
  import { ref, useTemplateRef } from 'vue';
  import { useRouter } from 'vue-router';
  import { apiSignIn } from '@/api/front/users';
  import { setToken } from '@/utils/auth';
  import { messageStore, loadingStore } from '@/stores';
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

  // 登入
  async function signIn() {
    openLoading();

    try {
      const res = await apiSignIn(user.value);
      const { data } = res.data;
      // 設定 token
      setToken(data.token);
      // 重置表單
      formRef.value?.resetForm();
      // 顯示訊息
      pushMessage({
        style: 'success',
        title: '登入成功',
        text: '登入成功，將跳轉至首頁',
      });
      // 跳轉至首頁
      router.push('/');
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
  <section class="d-flex flex-wrap justify-content-center aling-items-center my-17">
    <VForm
      class="accountForm bg-white rounded-3 shadow"
      v-slot="{ errors, meta }"
      @submit="signIn"
      ref="formRef"
    >
      <h1 class="mb-11 text-center h3">登入</h1>
      <p class="mb-11 text-center text-muted lh-lg">
        歡迎回到 燃味廚房，
        <span class="d-block"> 一起探索更多美味與驚喜靈感吧！ </span>
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
      <p class="mb-11 text-end">
        <router-link to="/forget-password" class="text-decoration-underline">
          忘記密碼？
        </router-link>
      </p>
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
      <router-link to="/signUp" class="d-block text-end text-decoration-underline">
        還未註冊會員？立即註冊
      </router-link>
    </VForm>
  </section>
</template>
