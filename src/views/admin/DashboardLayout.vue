<script setup lang="ts">
  import 'bootstrap/js/dist/dropdown';
  import 'bootstrap/js/dist/offcanvas';

  import { useRouter, useRoute } from 'vue-router';
  import { clearToken } from '@/utils/auth';
  import { messageStore } from '@/stores/admin';

  const router = useRouter();
  const route = useRoute();
  const messageRef = messageStore();
  const { pushMessage } = messageRef;

  // 登出
  function signOut() {
    clearToken();
    pushMessage({
      style: 'success',
      title: '登出成功',
      text: '登出成功，將跳轉至管理員登入頁面',
    });
    router.push('/admin-signin');
  }

  // 在路由切換後移除 offcanvas 在 body 上添加的 overflow 和 padding-right 樣式
  router.afterEach(() => {
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('padding-right');
  });
</script>

<template>
  <div class="position-relative">
    <aside class="sidebar bg-light">
      <div class="d-flex justify-content-between justify-content-xl-center align-items-center">
        <router-link to="/admin-signin" class="d-block px-8 py-2 text-center">
          <img src="../../assets/images/logo.svg" alt="logo" width="100" />
        </router-link>
        <a
          class="btn btn-primary d-xl-none border-0 fs-5 rounded-0"
          data-bs-toggle="offcanvas"
          href="#sidebarMenu"
          role="button"
          aria-controls="sidebarMenu"
        >
          <i class="bi bi-list"></i>
        </a>
      </div>
      <div
        class="offcanvas-xl offcanvas-end text-bg-light flex-fill"
        data-bs-backdrop="static"
        tabindex="-1"
        id="sidebarMenu"
        aria-labelledby="sidebarMenuLabel"
      >
        <div class="offcanvas-header">
          <h5 class="offcanvas-title" id="sidebarMenuLabel">
            <img src="../../assets/images/logo.svg" alt="logo" width="120" />
          </h5>

          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="offcanvas"
            data-bs-target="#sidebarMenu"
            aria-label="Close"
          ></button>
        </div>
        <div class="offcanvas-body d-flex flex-column justify-content-between h-100">
          <ul class="list-unstyled mx-11 mt-14 mb-0 p-0">
            <li class="mb-6">
              <p class="textLsLg text-muted">選單</p>
            </li>
            <li class="mb-6">
              <router-link to="/dashboard" class="menuLink d-block px-8 py-6 rounded-2">
                <i class="bi bi-speedometer me-8"></i>
                控制台
              </router-link>
            </li>
            <li class="mb-6">
              <router-link
                to="/dashboard/users"
                class="menuLink d-block px-8 py-6 rounded-2"
                :class="{ active: route.name === 'userEdit' }"
              >
                <i class="bi bi-people-fill me-8"></i>
                會員管理
              </router-link>
            </li>
            <li class="mb-6">
              <router-link to="/dashboard/categories" class="menuLink d-block px-8 py-6 rounded-2">
                <i class="bi bi-columns-gap me-8"></i>
                分類管理
              </router-link>
            </li>
            <li class="mb-6">
              <router-link to="/dashboard/tags" class="menuLink d-block px-8 py-6 rounded-2">
                <i class="bi bi-bookmarks me-8"></i>
                標籤管理
              </router-link>
            </li>
            <li class="mb-6">
              <router-link
                to="/dashboard/recipes"
                class="menuLink d-block px-8 py-6 rounded-2"
                :class="{ active: route.name === 'recipeEdit' }"
              >
                <i class="bi bi-cookie me-8"></i>
                食譜管理
              </router-link>
            </li>
            <li class="mb-6">
              <router-link to="/dashboard/images" class="menuLink d-block px-8 py-6 rounded-2">
                <i class="bi bi-image me-8"></i>
                圖片管理
              </router-link>
            </li>
            <li class="mb-6">
              <p class="textLsLg text-muted">其他</p>
            </li>
            <li class="mb-6">
              <a href="#" class="menuLink d-block px-8 py-6 rounded-2" @click.prevent="signOut">
                <i class="bi bi-door-open-fill me-8"></i>
                登出
              </a>
            </li>
          </ul>
        </div>
      </div>
    </aside>
    <main class="adminMain d-flex flex-column px-8 py-17 px-xl-17">
      <RouterView />
    </main>
  </div>
</template>

<style lang="scss">
  @import '@/assets/scss/admin.scss';
</style>
