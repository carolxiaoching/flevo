<script setup lang="ts">
  import { ref, useTemplateRef } from 'vue';
  import AlertModal from '@/components/AlertModal.vue';

  const alertModalRef = useTemplateRef<InstanceType<typeof AlertModal>>('alertModalRef');
  const formRef = useTemplateRef<HTMLFormElement>('formRef');
  const message = ref<{
    name: string;
    email: string;
    title: string;
    content: string;
  }>({
    name: '',
    email: '',
    title: '',
    content: '',
  });

  // 關閉 modal
  function closeAlertModal() {
    formRef.value?.resetForm();
    alertModalRef.value?.hideModal();
  }

  // 開啟 modal
  async function sendMessage() {
    alertModalRef.value?.openModal();
  }
</script>

<template>
  <div class="row">
    <div class="col-12 py-8">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <router-link to="/">首頁</router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">燃味信箱</li>
        </ol>
      </nav>
    </div>

    <div class="col-12 mb-14 mb-lg-16">
      <div class="contactBanner position-relative rounded-2 text-center text-white">
        <div
          class="contactBannerOverLay d-flex justify-content-center align-items-center position-absolute top-0 bottom-0 start-0 end-0"
        >
          <h1>燃味信箱</h1>
        </div>
      </div>
    </div>
    <div class="col-12 col-md-6 mb-16 mb-md-17">
      <div
        class="d-flex flex-column justify-content-center h-100 p-14 p-md-17 bg-white shadow-sm rounded"
      >
        <p class="mb-14 text-center text-muted lh-lg">
          我們重視您的意見和建議。如果您有任何疑問、反饋或需要進一步的幫助，請隨時與我們聯繫。我們的客服團隊將竭誠為您提供支持。
        </p>
        <ul class="mx-auto mb-14" style="max-width: 350px">
          <li class="mb-4">
            電子郵件：
            <a href="mailto: contact@flevo.com"> contact@flevo.com</a>
          </li>
          <li class="mb-4">
            聯絡電話：
            <a href="tel:+1234567">(00)1234567</a>
          </li>
          <li class="mb-4">通訊地址： 台北市信義區123號4樓</li>
        </ul>
        <p class="text-center text-muted lh-lg">
          您也可以通過右方的聯絡表單向我們發送訊息，我們會盡快回應您的需求。感謝您使用「燃味廚房」，期待與您的互動！
        </p>
        <div class="my-17 border"></div>
        <h2 class="mb-11 text-center h4">社群媒體</h2>
        <div class="d-flex justify-content-center">
          <a href="#" class="d-block me-11 fs-3">
            <i class="bi bi-line"></i>
          </a>
          <a href="#" class="d-block me-11 fs-3">
            <i class="bi bi-facebook"></i>
          </a>
          <a href="#" class="d-block me-11 fs-3">
            <i class="bi bi-instagram"></i>
          </a>
          <a href="#" class="d-block fs-3">
            <i class="bi bi-twitter-x"></i>
          </a>
        </div>
      </div>
    </div>
    <div class="col-12 col-md-6 mb-17">
      <VForm
        class="h-100 p-14 p-md-17 bg-white shadow-sm rounded"
        v-slot="{ errors, meta }"
        @submit="sendMessage"
        ref="formRef"
      >
        <div class="mb-8">
          <label for="name" class="d-block mb-4">
            <span class="text-danger">*</span>
            姓名：
          </label>
          <VField
            type="text"
            name="姓名"
            id="name"
            class="form-control"
            :class="{
              'is-invalid': errors['姓名'],
            }"
            placeholder="請輸入姓名"
            rules="min:1|max:10|required"
            v-model="message.name"
            required
          />
          <ErrorMessage name="姓名" class="text-danger" />
        </div>
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
            v-model="message.email"
            required
          />
          <ErrorMessage name="電子信箱" class="text-danger" />
        </div>
        <div class="mb-8">
          <label for="title" class="d-block mb-4">
            <span class="text-danger">*</span>
            標題：
          </label>
          <VField
            type="text"
            name="標題"
            id="title"
            class="form-control"
            :class="{
              'is-invalid': errors['標題'],
            }"
            placeholder="請輸入標題"
            rules="min:1|max:20|required"
            v-model="message.title"
            required
          />
          <ErrorMessage name="標題" class="text-danger" />
        </div>

        <div class="mb-14">
          <label for="content" class="form-label">
            <span class="text-danger">*</span>
            內容：
          </label>
          <VField
            as="textarea"
            id="content"
            type="text"
            rows="3"
            placeholder="請輸入內容"
            class="form-control"
            name="內容"
            :class="{
              'is-invalid': errors['內容'],
            }"
            v-model="message.content"
            rules="min:1|max:500|required"
            required
          />
          <ErrorMessage name="內容" class="invalid-feedback" />
        </div>
        <div class="text-center">
          <button
            type="submit"
            aria-disabled="true"
            class="btn btn-primary w-75"
            :class="{ disabled: !meta.valid }"
            :disabled="!meta.valid"
          >
            送出訊息
          </button>
        </div>
      </VForm>
    </div>
  </div>

  <AlertModal ref="alertModalRef">
    <template #modal-header>
      <span class="titleIcon bg-secondary text-white">
        <i class="bi bi-envelope-paper-heart-fill"></i>
      </span>
      感謝您的回饋
    </template>
    <template #modal-content> 我們已收到您的回饋，將於 7 個工作天內回覆您的訊息 </template>
    <template #modal-footer>
      <button type="button" class="btn btn-primary w-50" @click="closeAlertModal">關閉</button>
    </template>
  </AlertModal>
</template>
