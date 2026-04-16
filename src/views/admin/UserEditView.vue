<script setup lang="ts">
  import { Form } from 'vee-validate';
  import { ref, onMounted, useTemplateRef } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { apiAdminGetUser, apiAdminUpdateUser } from '@/api/admin/adminUsers';
  import { loadingStore, messageStore } from '@/stores/admin';
  import UploadComponent from '@/components/UploadComponent.vue';
  import type { AppErrorResponse } from '@/types/common';
  import type { AdminUserDetail } from '@/types/admin/adminUser';

  const router = useRouter();
  const route = useRoute();
  const loadingRef = loadingStore();
  const messageRef = messageStore();
  const { openLoading, closeLoading } = loadingRef;
  const { pushMessage } = messageRef;

  const formRef = useTemplateRef<InstanceType<typeof Form>>('formRef');
  const user = ref<AdminUserDetail>({
    _id: '',
    nickName: '',
    avatarImgUrl: '',
    gender: 'secret',
    description: '',
    email: '',
    role: 'member',
    collects: [],
    createdAt: '',
    updatedAt: '',
  });
  const tempBasic = ref<{
    nickName: string;
    avatarImgUrl: string;
    gender: 'male' | 'female' | 'secret';
    description: string;
    role: 'member' | 'admin';
  }>({
    nickName: '',
    avatarImgUrl: '',
    gender: 'secret',
    description: '',
    role: 'member',
  });
  const tempAvatarImgUrl = ref<string>('');

  // 取得會員資料
  async function getUser(id: string) {
    openLoading();

    try {
      const res = await apiAdminGetUser(id);
      const { data } = res.data;
      user.value = { ...data };
      tempBasic.value = {
        nickName: data.nickName,
        avatarImgUrl: data.avatarImgUrl,
        gender: data.gender,
        description: data.description,
        role: data.role,
      };
      tempAvatarImgUrl.value = data.avatarImgUrl;
      closeLoading();
    } catch (err) {
      pushMessage({
        style: 'danger',
        title: '載入失敗',
        text: (err as AppErrorResponse).message || '會員取得失敗，將轉回會員列表頁面',
      });
      closeLoading();
      router.push('/dashboard/users');
    }
  }

  // 更新會員基本資料
  async function updateUser(
    item: {
      nickName?: string;
      gender?: 'male' | 'female' | 'secret';
      avatarImgUrl?: string;
      description?: string;
      role?: 'member' | 'admin';
    } = {},
  ) {
    try {
      await apiAdminUpdateUser(user.value._id, item);
      await getUser(user.value._id);
      pushMessage({
        style: 'success',
        title: '更新成功',
        text: '更新成功',
      });
    } catch (err) {
      pushMessage({
        style: 'danger',
        title: '更新失敗',
        text: (err as AppErrorResponse).message || '更新失敗，請重整網頁',
      });
    }
  }

  // 更新圖片
  function uploadImage(imageUrl: string) {
    updateUser({ avatarImgUrl: imageUrl });
  }

  onMounted(() => {
    const { id } = route.params;
    if (id && typeof id === 'string') {
      getUser(id);
    } else {
      pushMessage({
        style: 'danger',
        title: '請輸入正確會員 ID',
        text: '會員 ID 錯誤',
      });
      router.push('/dashboard/users');
    }
  });
</script>

<template>
  <div class="container-fluid">
    <div class="row gx-16 justify-content-center">
      <div class="col-12 mb-14">
        <h1 class="h3">編輯會員</h1>
      </div>
      <div class="col-12 col-xxl-6 mb-16">
        <div class="d-flex flex-column h-100 py-16 px-14 px-md-16 bg-white rounded shadow-sm">
          <h2 class="title mb-11">
            <span class="titleIcon bg-secondary-subtle">
              <i class="bi bi-image-fill"></i>
            </span>
            <span> 會員頭像 </span>
          </h2>
          <div class="flex-fill d-flex flex-column justify-content-center m-lg-16">
            <UploadComponent
              :temp-image-url="tempAvatarImgUrl"
              imageType="avatar"
              @update-image="uploadImage"
            />
          </div>
        </div>
      </div>
      <div class="col-12 col-xxl-6 mb-16">
        <div class="p-14 p-md-16 bg-white shadow-sm rounded">
          <h2 class="title mb-11">
            <span class="titleIcon bg-secondary-subtle">
              <i class="bi bi-image-fill"></i>
            </span>
            <span> 基本資料 </span>
          </h2>
          <VForm ref="formRef" v-slot="{ errors, meta }" @submit="updateUser(tempBasic)">
            <div class="mb-8">
              <label for="id" class="form-label"> 會員編號： </label>
              <input
                type="text"
                name="id"
                id="id"
                class="form-control"
                :value="user._id"
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
                :value="user.email"
                disabled
              />
            </div>
            <div class="mb-8">
              <label for="nickName" class="form-label"> 暱稱： </label>
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
              <label for="gender" class="form-label"> 性別： </label>
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
            <div class="mb-8">
              <label for="role" class="form-label"> 權限： </label>
              <VField
                as="select"
                name="權限"
                id="role"
                class="form-select"
                :class="{ 'is-invalid': errors['權限'] }"
                placeholder="請選擇權限"
                rules="required"
                v-model="tempBasic.role"
                required
              >
                <option value="member" select>會員</option>
                <option value="admin">管理員</option>
              </VField>
              <ErrorMessage name="權限" class="invalid-feedback" />
            </div>
            <div class="mb-16">
              <label for="description" class="form-label"> 自我介紹： </label>
              <VField
                as="textarea"
                id="description"
                type="text"
                rows="3"
                placeholder="請輸入自我介紹"
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
                更新基本資料
              </button>
            </div>
          </VForm>
        </div>
      </div>
      <div class="col-12 text-center">
        <router-link to="/dashboard/users" class="btn btn-outline-primary">
          <i class="bi bi-arrow-90deg-left me-8"></i>
          返回會員列表
        </router-link>
      </div>
    </div>
  </div>
</template>
