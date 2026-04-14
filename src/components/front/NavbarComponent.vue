<script setup lang="ts">
  import 'bootstrap/js/dist/dropdown';
  import 'bootstrap/js/dist/collapse';

  import { ref, onMounted, onUnmounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { storeToRefs } from 'pinia';
  import { clearToken } from '@/utils/auth';
  import { messageStore, userStore } from '@/stores';

  const router = useRouter();
  const route = useRoute();
  const messageRef = messageStore();
  const userRef = userStore();
  const { pushMessage } = messageRef;
  const { updateMyProfile, checkLogin } = userRef;
  const { myProfile, isLogin } = storeToRefs(userRef);

  const searchShow = ref<boolean>(false);
  const scrollTop = ref<number>(0);
  const keyword = ref<string>('');

  // 登出
  function signOut() {
    clearToken();
    updateMyProfile('reset');
    pushMessage({
      style: 'success',
      title: '登出成功',
      text: '登出成功，將跳轉至首頁',
    });

    const currentPage = router.currentRoute?.value?.name;
    if (currentPage === 'home') {
      router.go(0);
    } else {
      router.push('/');
    }
  }

  // nav 滾動固定
  function scrolling() {
    if (route.name !== 'home') return;

    scrollTop.value = window.scrollY;
    document.body.classList.toggle('fixedNav', scrollTop.value > 60);
  }

  // 開啟/關閉 搜尋
  function toggleSearch() {
    if (keyword.value.trim()) {
      search();
    } else {
      searchShow.value = !searchShow.value;
    }
  }

  // 關鍵字搜尋
  function search() {
    const text: string = keyword.value.trim();
    if (text) {
      router.push({ name: 'recipes', query: { keyword: text } });
      keyword.value = '';
      searchShow.value = false;
    }
  }

  onMounted(() => {
    window.addEventListener('scroll', scrolling);
    checkLogin();
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', scrolling);
  });
</script>

<template>
  <nav
    class="navbar navbar-expand-lg z-990 w-100"
    :class="{
      'position-fixed': route.name === 'home',
    }"
  >
    <div class="container-lg">
      <router-link to="/" class="navbar-brand me-0">
        <img src="../../assets/images/logo.svg" alt="logo" class="d-none d-xl-block" />
        <img src="../../assets/images/logo-sm.svg" alt="logo" class="d-xl-none" />
      </router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav w-100 mb-8 mb-lg-0 text-center text-lg-start">
          <li class="navbarDivider d-none d-lg-block ms-11 pe-8 border-start"></li>
          <li class="nav-item">
            <router-link to="/" class="nav-link">首頁</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/recipes" class="nav-link">靈感食譜</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/about" class="nav-link mb-4 mb-lg-0">燃味故事</router-link>
          </li>
          <li class="nav-item ms-lg-auto mb-8 mb-lg-0">
            <div class="d-inline-block">
              <div
                class="d-flex justify-content-center bg-white border border-muted rounded-2 overflow-hidden"
                :class="{ searchShow: searchShow }"
              >
                <div class="searchText">
                  <input
                    type="text"
                    class="searchInput w-100 p-0 border-0"
                    v-model="keyword"
                    @keyup.enter="search"
                  />
                </div>
                <a href="#" class="searchBtn px-6 py-2 fs-5" @click.prevent="toggleSearch">
                  <i class="bi bi-search"></i>
                </a>
              </div>
            </div>
          </li>
          <li class="navbarDivider d-none d-lg-block ms-11 pe-11 border-start"></li>
          <li class="nav-item dropdown" v-if="isLogin && myProfile._id">
            <a
              class="dropdown-toggle d-flex justify-content-center align-items-center mb-4 mb-lg-0"
              href="#"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                v-lazy="myProfile.avatarImgUrl"
                alt="avatar"
                class="dropdownBtnImg d-block bg-white rounded-circle object-fit-cover text-center text-white fs-4"
                v-if="myProfile.avatarImgUrl"
              />
              <span
                class="dropdownBtnImg d-block bg-dark-subtle rounded-circle object-fit-cover text-center text-white fs-4"
                v-else
              >
                <i class="bi bi-person-fill"></i>
              </span>
            </a>
            <ul class="dropdown-menu dropdown-menu-end text-center">
              <li>
                <router-link
                  :to="`/user/${myProfile._id}`"
                  class="dropdown-item dropdownItem"
                  :class="{
                    dropdownItemActive: route.name === 'user' && !route.query.current,
                  }"
                >
                  個人頁面
                </router-link>
              </li>
              <li>
                <router-link
                  :to="`/user/${myProfile._id}?current=我的收藏`"
                  class="dropdown-item dropdownItem"
                  :class="{
                    dropdownItemActive:
                      route.name === 'user' && route.query?.current === '我的收藏',
                  }"
                >
                  收藏食譜
                </router-link>
              </li>
              <li>
                <router-link to="/recipe-edit/new" class="dropdown-item"> 新增食譜 </router-link>
              </li>
              <li>
                <hr class="dropdown-divider" />
              </li>
              <li>
                <router-link to="/setting" class="dropdown-item"> 帳號設定 </router-link>
              </li>
              <li>
                <a class="dropdown-item" href="#" @click.prevent="signOut">登出</a>
              </li>
            </ul>
          </li>
          <li class="nav-item" v-else>
            <router-link to="/signIn" class="btn btn-primary me-8 px-11 py-4"> 登入 </router-link>
            <router-link to="/signUp" class="btn btn-outline-primary px-11 py-4">
              註冊
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
