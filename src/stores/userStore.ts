import { ref } from 'vue';
import { defineStore } from 'pinia';
import { loadingStore, messageStore } from './index.js';
import { apiGetMyProfile } from '@/api/front/users';
import { apiCreateCollect, apiDelCollect } from '@/api/front/recipes';
import { getToken, clearToken } from '@/utils/auth';
import type { UserDetail } from '@/types/front/user';
import type { AppErrorResponse } from '@/types/common';

export default defineStore('userStore', () => {
  const loading = loadingStore();
  const message = messageStore();

  const isLogin = ref<boolean>(false);
  const myProfile = ref<UserDetail & { email: string }>({
    email: '',
    nickName: '',
    gender: 'secret',
    description: '',
    avatarImgUrl: '',
    createdAt: '',
    updatedAt: '',
    _id: '',
    collects: [],
    collectCount: 0,
    recipeCount: 0,
  });

  // 確認是否登入
  function checkLogin() {
    const token = getToken();
    if (token) {
      isLogin.value = true;
      getMyProfile();
    } else {
      isLogin.value = false;
      clearToken();
      updateMyProfile('reset');
    }
  }

  // 取得我的資料
  async function getMyProfile() {
    loading.openLoading();
    try {
      const res = await apiGetMyProfile();

      updateMyProfile('update', res.data.data);

      loading.closeLoading();
    } catch (err) {
      clearToken();
      updateMyProfile('reset');

      message.pushMessage({
        style: 'danger',
        title: '取得用戶資料失敗',
        text: (err as AppErrorResponse).message || '取得用戶資料失敗，請重新註冊',
      });
      loading.closeLoading();
    }
  }

  // 更新我的資料
  function updateMyProfile(action: string, data?: UserDetail & { email: string }) {
    if (action === 'reset') {
      myProfile.value = {
        email: '',
        nickName: '',
        gender: 'secret',
        description: '',
        avatarImgUrl: '',
        createdAt: '',
        updatedAt: '',
        _id: '',
        collects: [],
        collectCount: 0,
        recipeCount: 0,
      };
    } else if (data) {
      myProfile.value = data;
    }
  }

  // 收藏/取消收藏
  async function toggleCollect({
    active,
    recipeId,
  }: {
    active: 'create' | 'remove';
    recipeId: string;
  }) {
    if (myProfile.value._id == '') {
      message.pushMessage({
        style: 'danger',
        title: '收藏失敗',
        text: '請先登入會員',
      });
      return;
    }
    const apiMethods = {
      create: apiCreateCollect,
      remove: apiDelCollect,
    };
    try {
      loading.openLoading();
      await apiMethods[active](recipeId);
      message.pushMessage({
        style: 'success',
        title: `${active == 'create' ? '新增' : '取消'}收藏成功`,
        text: `${active == 'create' ? '新增' : '取消'}收藏成功`,
      });
      loading.closeLoading();
      await getMyProfile();
    } catch (err) {
      message.pushMessage({
        style: 'danger',
        title: `${active == 'create' ? '新增' : '取消'}收藏失敗`,
        text:
          (err as AppErrorResponse).message ||
          `${active == 'create' ? '新增' : '取消'}收藏失敗，請重整網頁`,
      });
      loading.closeLoading();
    }
  }

  return {
    isLogin,
    myProfile,
    checkLogin,
    getMyProfile,
    updateMyProfile,
    toggleCollect,
  };
});
