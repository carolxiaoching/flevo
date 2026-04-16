<script setup lang="ts">
  import { ref, watch, useTemplateRef } from 'vue';
  import { storeToRefs } from 'pinia';
  import { apiUpdateProfile, apiUpdatePassword } from '@/api/front/users';
  import UploadComponent from '@/components/UploadComponent.vue';
  import { messageStore, loadingStore, userStore } from '@/stores/front';
  import type { AppErrorResponse } from '@/types/common';

  const userRef = userStore();
  const loadingRef = loadingStore();
  const messageRef = messageStore();
  const { openLoading, closeLoading } = loadingRef;
  const { pushMessage } = messageRef;
  const { updateMyProfile } = userRef;
  const { myProfile } = storeToRefs(userRef);

  const passwordFormRef = useTemplateRef<HTMLFormElement>('passwordFormRef');
  const currentTab = ref<string>('基本資料');
  const tempBasic = ref<{
    gender: 'male' | 'female' | 'secret';
    nickName: string;
    description: string;
  }>({
    gender: 'secret',
    nickName: '',
    description: '',
  });
  const tempAvatarImgUrl = ref<string>('');
  const tempAccount = ref<{
    password: string;
    confirmPassword: string;
  }>({
    password: '',
    confirmPassword: '',
  });

  watch(
    myProfile,
    data => {
      tempBasic.value = {
        nickName: data.nickName,
        gender: data.gender,
        description: data.description,
      };
      tempAvatarImgUrl.value = data.avatarImgUrl;
    },
    { immediate: true, deep: true },
  );

  // 更新會員資料
  async function updateNewProfile(
    item: {
      nickName?: string;
      gender?: 'male' | 'female' | 'secret';
      avatarImgUrl?: string;
      description?: string;
    } = {},
  ) {
    openLoading();
    try {
      const res = await apiUpdateProfile(item);
      updateMyProfile('update', res.data.data);

      pushMessage({
        style: 'success',
        title: '更新成功',
        text: '更新成功',
      });
      closeLoading();
    } catch (err) {
      pushMessage({
        style: 'danger',
        title: '更新失敗',
        text: (err as AppErrorResponse).message || '更新失敗，請重整網頁',
      });
      closeLoading();
    }
  }

  // 更新圖片
  function uploadImage(imageUrl: string) {
    updateNewProfile({ avatarImgUrl: imageUrl });
  }

  // 更新密碼
  async function updatePassword() {
    openLoading();
    try {
      await apiUpdatePassword(tempAccount.value);
      pushMessage({
        style: 'success',
        title: '更新密碼成功',
        text: '更新密碼成功，未來請使用新密碼登入',
      });
      passwordFormRef.value?.resetForm();
      closeLoading();
    } catch (err) {
      pushMessage({
        style: 'danger',
        title: '更新密碼失敗',
        text: (err as AppErrorResponse).message || '更新密碼失敗，請重新整理頁面',
      });
      closeLoading();
    }
  }
</script>

<template>
  <div class="row py-17">
    <div class="col-12 col-xl-3">
      <h5 class="sidebarTitle">帳號設定</h5>
      <ul class="sidebarList">
        <li>
          <a
            href="#"
            class="sidebarLink"
            :class="{ active: currentTab == '基本資料' }"
            @click.prevent="currentTab = '基本資料'"
          >
            基本資料
          </a>
        </li>
        <li>
          <a
            href="#"
            class="sidebarLink"
            :class="{ active: currentTab == '個人頭像' }"
            @click.prevent="currentTab = '個人頭像'"
          >
            個人頭像
          </a>
        </li>
        <li>
          <a
            href="#"
            class="sidebarLink"
            :class="{ active: currentTab == '更新密碼' }"
            @click.prevent="currentTab = '更新密碼'"
          >
            更新密碼
          </a>
        </li>
      </ul>
    </div>
    <div class="col-12 col-xl-7">
      <div
        v-if="currentTab == '基本資料'"
        class="px-16 px-md-18 py-16 mx-auto bg-white shadow-sm rounded"
      >
        <VForm ref="formRef" v-slot="{ errors, meta }" @submit="updateNewProfile(tempBasic)">
          <h2 class="title mb-11">
            <span class="titleIcon bg-secondary-subtle">
              <i class="bi bi-people-fill"></i>
            </span>
            <span> 基本資料 </span>
          </h2>
          <div class="mb-8">
            <label for="id" class="form-label"> 會員編號： </label>
            <input
              type="text"
              name="id"
              id="id"
              class="form-control"
              :value="myProfile._id"
              disabled
            />
          </div>
          <div class="mb-8">
            <label for="email" class="form-label"> 電子信箱： </label>
            <input
              type="email"
              name="email"
              id="email"
              class="form-control"
              :value="myProfile.email"
              disabled
            />
          </div>
          <div class="mb-8">
            <label for="nickName" class="form-label">
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
              v-model="tempBasic.nickName"
              required
            />
            <ErrorMessage name="暱稱" class="invalid-feedback" />
          </div>
          <div class="mb-8">
            <label for="gender" class="form-label">
              <span class="text-danger">*</span>
              性別：
            </label>
            <VField
              as="select"
              name="性別"
              id="gender"
              class="form-select"
              :class="{ 'is-invalid': errors['性別'] }"
              placeholder="請選擇性別"
              rules="required"
              v-model="tempBasic.gender"
              required
            >
              <option value="secret" select>秘密</option>
              <option value="female">女生</option>
              <option value="male">男生</option>
            </VField>
            <ErrorMessage name="性別" class="invalid-feedback" />
          </div>
          <div class="mb-16">
            <label for="description" class="form-label"> 自我介紹： </label>
            <VField
              as="textarea"
              type="text"
              rows="3"
              placeholder="請輸入自我介紹"
              id="description"
              class="form-control"
              name="自我介紹"
              :class="{
                'is-invalid': errors['自我介紹'],
              }"
              rules="max:100"
              v-model="tempBasic.description"
            />
            <ErrorMessage name="自我介紹" class="invalid-feedback" />
          </div>
          <div class="text-center">
            <button
              type="submit"
              aria-disabled="true"
              class="btn btn-primary w-75"
              :class="{ disabled: !meta.valid }"
              :disabled="!meta.valid"
            >
              更新資料
            </button>
          </div>
        </VForm>
      </div>
      <div
        v-if="currentTab == '個人頭像'"
        class="px-16 px-md-18 py-16 mx-auto bg-white shadow-sm rounded"
      >
        <h2 class="title mb-2">
          <span class="titleIcon bg-secondary-subtle">
            <i class="bi bi-people-fill"></i>
          </span>
          <span> 個人頭像 </span>
        </h2>
        <p class="mb-11 text-center text-muted">
          <small> （圖片限制在 1 MB 以下） </small>
        </p>
        <UploadComponent
          :temp-image-url="tempAvatarImgUrl"
          imageType="avatar"
          @update-image="uploadImage"
        />
      </div>
      <div
        v-if="currentTab == '更新密碼'"
        class="px-16 px-md-18 py-16 mx-auto bg-white shadow-sm rounded"
      >
        <VForm ref="passwordFormRef" v-slot="{ errors, meta }" @submit="updatePassword()">
          <h2 class="title mb-11">
            <span class="titleIcon bg-secondary-subtle">
              <i class="bi bi-people-fill"></i>
            </span>
            <span> 更新密碼 </span>
          </h2>
          <div class="mb-8">
            <label for="password" class="form-label">
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
              v-model="tempAccount.password"
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
              v-model="tempAccount.confirmPassword"
              required
            />
            <ErrorMessage name="確認密碼" class="text-danger" />
          </div>
          <div class="text-center">
            <button
              type="submit"
              aria-disabled="true"
              class="btn btn-primary w-75"
              :class="{ disabled: !meta.valid }"
              :disabled="!meta.valid"
            >
              更新資料
            </button>
          </div>
        </VForm>
      </div>
    </div>
  </div>
</template>
