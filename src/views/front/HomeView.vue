<script setup lang="ts">
  // 第三方套件
  import { Form } from 'vee-validate';
  import { useRouter } from 'vue-router';
  import { onMounted, ref, onUnmounted, defineAsyncComponent, useTemplateRef } from 'vue';
  import { storeToRefs } from 'pinia';
  import { messageStore, loadingStore, tagAndCategoryStore } from '@/stores/front';
  import { apiGetRecipes } from '@/api/front/recipes';
  import type { AppErrorResponse } from '@/types/common';
  import type { Recipe } from '@/types/front/recipe';

  // gsap 載入
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  gsap.registerPlugin(ScrollTrigger);

  // 元件
  import AlertModal from '@/components/AlertModal.vue';
  import CardComponent from '@/components/front/CardComponent.vue';
  const HeroSwiper = defineAsyncComponent({
    loader: () => import('@/components/front/HeroSwiper.vue'),
    loadingComponent: { template: '<div class="heroSwiperSkeleton"></div>' },
    delay: 0,
  });

  // 靜態資源
  import featureImg1 from '@/assets/images/icon/feature1.svg';
  import featureImg2 from '@/assets/images/icon/feature2.svg';
  import featureImg3 from '@/assets/images/icon/feature3.svg';
  import featureImg4 from '@/assets/images/icon/feature4.svg';

  const router = useRouter();
  const loadingRef = loadingStore();
  const messageRef = messageStore();
  const tagAndCategoryRef = tagAndCategoryStore();
  const { openLoading, closeLoading } = loadingRef;
  const { pushMessage } = messageRef;
  const { getTagsAndCategories } = tagAndCategoryRef;
  const { categories, tags } = storeToRefs(tagAndCategoryRef);

  // 食譜列表跟特色區塊資料
  const hotRecipes = ref<Recipe[]>([]);
  const recentRecipes = ref<Recipe[]>([]);
  const recommendRecipes = ref<Recipe[]>([]);
  const feature = ref<Array<{ img: string; title: string; content: string }>>([
    {
      img: featureImg1,
      title: '記錄專屬食譜',
      content: '讓您輕鬆記錄和保存每一道獨家美味，不再擔心食譜遺失',
    },
    {
      img: featureImg2,
      title: '收藏夾功能',
      content: '方便地收藏和管理您喜愛的食譜，隨時輕鬆查找和使用。',
    },
    {
      img: featureImg3,
      title: '分享烹飪創意',
      content: '輕鬆分享您的創新料理，讓美食愛好者學習您的獨特風味。',
    },
    {
      img: featureImg4,
      title: '探索美味靈感',
      content: '來自世界各地的豐富美味食譜，讓烹飪創作充滿靈感和新意',
    },
  ]);

  // 取得食譜列表
  async function getRecipes() {
    openLoading();
    try {
      const [hotRecipesRes, recentRecipesRes, recommendRecipesRes] = await Promise.all([
        apiGetRecipes({ sort: 'hot' }), // 熱門食譜
        apiGetRecipes({ sort: 'desc' }), // 最新食譜
        apiGetRecipes({ isRecommended: true }), // 編輯推薦
      ]);

      hotRecipes.value = hotRecipesRes.data.data.results;
      recentRecipes.value = recentRecipesRes.data.data.results;
      recommendRecipes.value = recommendRecipesRes.data.data.results;

      closeLoading();
    } catch (err) {
      pushMessage({
        style: 'danger',
        title: '取得食譜列表失敗',
        text: (err as AppErrorResponse).message || '請重整網頁再試一次',
      });
      closeLoading();
    }
  }

  // 動畫
  const featureRef = useTemplateRef<HTMLDivElement>('featureRef');
  const featureBgPathRef = useTemplateRef<HTMLImageElement>('featureBgPathRef');

  // gsap 動畫
  function getPathAnimation() {
    gsap.fromTo(
      featureBgPathRef.value,
      { clipPath: 'inset(0% 100% 0% 0%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: featureRef.value,
          // 當 feature 區塊頂部觸碰到 螢幕上方 10% 時觸發動畫
          start: 'top 10%',
          toggleActions: 'play none none none',
        },
      },
    );
  }

  // 訂閱
  const alertModalRef = useTemplateRef<InstanceType<typeof AlertModal>>('alertModalRef');
  const formRef = useTemplateRef<InstanceType<typeof Form>>('formRef');
  const subscriptionEmail = ref<string>('');

  function handleSubscriptionModal(show: boolean) {
    if (show) {
      alertModalRef.value?.openModal();
    } else {
      formRef.value?.resetForm();
      alertModalRef.value?.hideModal();
    }
  }

  onMounted(async () => {
    if (!tags.value.length || !categories.value.length) {
      await getTagsAndCategories();
    }

    getRecipes();
    getPathAnimation();
  });

  onUnmounted(() => {
    if (ScrollTrigger) {
      ScrollTrigger.killAll();
    }
  });
</script>

<template>
  <section class="hero container-fluid position-relative mb-22 mb-xl-0">
    <img src="../../assets/images/icon/hero-path1.svg" alt="path" class="heroBgPath heroBgPath1" />
    <img src="../../assets/images/icon/hero-path2.svg" alt="path" class="heroBgPath heroBgPath2" />

    <div class="row align-items-center justify-content-center">
      <div class="heroContent col-12 col-xl-6">
        <div class="text-center">
          <img
            src="../../assets/images/icon/hero-path-img1.svg"
            alt="path"
            class="heroBgImg heroBgImg1"
          />

          <h1 class="mb-17 text-primary display-4 fw-bold">
            <img src="../../assets/images/logo.svg" alt="logo" width="300" />
            <span class="d-block">燃味廚房</span>
          </h1>
          <p class="mb-4 text-muted fw-medium">在這裡，您可以輕鬆記錄、分享和發現各式各樣的食譜</p>
          <p class="mb-17 text-muted fw-medium">讓烹飪變得更簡單、更有趣，讓每餐都充滿驚喜！</p>
          <button
            type="button"
            class="heroBtn btn btn-primary rounded-pill px-20"
            @click="router.push('/recipes')"
          >
            立即探索
            <span class="heroBtnArrow"></span>
          </button>
        </div>
      </div>

      <div class="col-12 col-xl-6 position-relative heroSwiperArea">
        <HeroSwiper :recipes="recommendRecipes" />
      </div>
    </div>
  </section>

  <section ref="featureRef" class="feature position-relative mb-xl-25 pb-22 py-xl-25">
    <img
      ref="featureBgPathRef"
      src="../../assets/images/icon/feature-path1.svg"
      alt="path"
      class="featureBgPath"
    />

    <div class="container text-center">
      <h2 class="mb-12 h3">燃味廚房，發現美味的秘密！</h2>
      <p class="featureSubtitle textLs mx-auto mb-18 mb-md-22 text-muted">
        探索燃味廚房，讓每道料理都成為你獨特的創作！在這裡，你可以輕鬆記錄、分享和發現各式各樣的食譜，讓烹飪變得更簡單、更有趣，讓每餐都充滿驚喜！
      </p>
      <ul class="row gy-17 mb-0 list-unstyled">
        <li
          class="col-12 col-sm-6 col-lg-3"
          v-for="(featureItem, key) in feature"
          :key="`feature-${key}`"
        >
          <img :src="featureItem.img" :alt="featureItem.title" class="mb-8" width="120" />
          <p class="mb-8 fs-6 fw-medium">{{ featureItem.title }}</p>
          <p class="featureContent textLs mx-auto text-muted">{{ featureItem.content }}</p>
        </li>
      </ul>
    </div>
  </section>

  <section class="position-relative mb-22 mb-xl-25">
    <img
      src="../../assets/images/icon/trending-path1.svg"
      alt="path"
      class="trendingBgPath trendingBgPath1"
    />
    <img
      src="../../assets/images/icon/trending-path2.svg"
      alt="path"
      class="trendingBgPath trendingBgPath2"
    />

    <div class="container mb-18 mb-xl-24 position-relative">
      <img
        src="../../assets/images/icon/trending-path-img1.svg"
        alt="path"
        class="trendingBgImg trendingBgImg1"
      />
      <div class="row flex-lg-row-reverse">
        <div class="col-lg-5 col-md-12 position-relative mb-18 mb-xl-0">
          <div class="d-flex flex-column position-relative w-100">
            <div class="trendingTitle mb-12 mb-xl-18 text-end">
              <p class="d-none d-md-block mb-md-4">手作的溫度，美味的起點</p>
              <h2 class="textLsSm font-semibold lh-base fs-4 fs-sm-3 fs-lg-2">
                新鮮剛出爐，<br />滿溢幸福滋味
              </h2>
            </div>

            <div class="trendingMask trendingMask1"></div>
          </div>
        </div>

        <div class="col-lg-7 col-md-12">
          <div class="row g-5 justify-content-center">
            <div class="col-md-9 col-lg-6 col-xxl-5">
              <CardComponent
                class="cardDown"
                :recipe="recentRecipes[0]"
                :categories="categories"
                mode="home"
              ></CardComponent>
            </div>

            <div class="col-md-9 col-lg-6 col-xxl-5">
              <CardComponent
                :recipe="recentRecipes[1]"
                :categories="categories"
                mode="home"
              ></CardComponent>
              <CardComponent
                :recipe="recentRecipes[2]"
                :categories="categories"
                mode="home"
              ></CardComponent>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container position-relative">
      <img
        src="../../assets/images/icon/trending-path-img2.svg"
        alt="path"
        class="trendingBgImg trendingBgImg2"
      />

      <div class="row">
        <div class="col-lg-5 col-md-12 position-relative mb-18 mb-xl-0">
          <div class="d-flex flex-column position-relative w-100">
            <div class="trendingTitle mb-12 mb-xl-18 text-start">
              <p class="d-none d-md-block mb-md-4">大眾的選擇，好評的印證</p>
              <h2 class="textLsSm font-semibold lh-base fs-4 fs-sm-3 fs-lg-2">
                人氣最經典，<br />吃過都說想念
              </h2>
            </div>

            <div class="trendingMask trendingMask2"></div>
          </div>
        </div>

        <div class="col-lg-7 col-md-12">
          <div class="row g-5 justify-content-center">
            <div class="col-md-9 col-lg-6 col-xxl-5">
              <CardComponent
                :recipe="hotRecipes[1]"
                :categories="categories"
                mode="home"
              ></CardComponent>
              <CardComponent
                :recipe="hotRecipes[2]"
                :categories="categories"
                mode="home"
              ></CardComponent>
            </div>

            <div class="col-md-9 col-lg-6 col-xxl-5">
              <CardComponent
                class="cardDown"
                :recipe="hotRecipes[0]"
                :categories="categories"
                mode="home"
              ></CardComponent>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="position-relative pb-xl-22 pb-18">
    <img src="../../assets/images/icon/category-path1.svg" alt="path" class="discoveryBgPath" />
    <img src="../../assets/images/icon/category-path-img1.svg" alt="path" class="discoveryBgImg" />

    <section class="container mb-18 mb-md-22 text-center">
      <h2 class="mb-12 h3">
        尋找靈感？
        <span class="d-block d-md-inline mt-2"> 從分類與標籤開始！ </span>
      </h2>
      <p class="categoriesSubtitle textLs mx-auto mb-16 mb-md-22 text-muted">
        不確定要煮什麼嗎？使用分類與標籤，輕鬆找到你喜愛的食譜，無論是快速料理、健康餐點，還是異國風味，幫助你快速找到適合的食譜靈感！
      </p>
      <div class="row align-items-center">
        <div class="col-12 col-lg-6 mb-10 mb-lg-0">
          <div class="d-flex flex-wrap justify-content-center">
            <router-link
              class="categoryBadge d-block mx-8 mx-md-14 mx-lg-8 mx-xl-14 mb-12"
              :to="`/recipes?category=${category._id}`"
              v-for="category in categories.slice(0, 6)"
              :key="category._id"
            >
              <div class="categoryBadgeImage p-8 rounded-4">
                <img
                  :src="category.categoryImgUrl"
                  :alt="category.title"
                  class="categoryBadgeIcon"
                />
              </div>
              <span class="d-block mt-4 text-center h5">
                {{ category.title }}
              </span>
            </router-link>
          </div>
        </div>
        <div class="col-12 col-lg-6">
          <div class="d-flex justify-content-center flex-wrap mx-auto p-0">
            <router-link
              class="tagBadge d-block mx-4 mx-xxl-10 my-3 my-xl-8 px-8 px-xxl-14 py-4 py-xxl-8 rounded-2 fw-semibold"
              v-for="tag in tags.slice(0, 9)"
              :key="tag._id"
              :to="`/recipes?tag=${tag._id}`"
            >
              # {{ tag.title }}
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <section class="container position-relative">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-8">
          <div class="subscription p-14 p-xl-17 rounded-4">
            <h2 class="h3 mb-8 text-center text-lg-start">加入我們的美食訂閱</h2>
            <p class="textLsSm mb-14 text-center text-lg-start text-muted lh-lg">
              訂閱我們，獲取最新的美食食譜、烹飪技巧和專屬優惠！
              讓您的廚房創作更加豐富多彩，讓美食陪伴您的每一天！
            </p>
            <VForm v-slot="{ errors, meta }" @submit="handleSubscriptionModal(true)" ref="formRef">
              <label for="EmailSubmit" class="d-block mb-4">
                <span class="text-danger">*</span>
                電子信箱
              </label>
              <div class="input-group">
                <VField
                  type="email"
                  name="電子信箱"
                  id="EmailSubmit"
                  class="form-control"
                  :class="{
                    'is-invalid': errors['電子信箱'],
                  }"
                  placeholder="請輸入電子信箱"
                  rules="email|required"
                  v-model="subscriptionEmail"
                  required
                />
                <button
                  type="submit"
                  class="subscriptionBtn btn btn-primary px-16"
                  :class="{ disabled: !meta.valid }"
                  :disabled="!meta.valid"
                >
                  確認訂閱
                </button>
              </div>

              <ErrorMessage name="電子信箱" class="d-block text-danger" />
            </VForm>
          </div>
        </div>
      </div>
    </section>
  </div>

  <AlertModal ref="alertModalRef">
    <template #modal-header>
      <span class="titleIcon bg-secondary text-white">
        <i class="bi bi-bell-fill"></i>
      </span>
      感謝您的訂閱
    </template>
    <template #modal-content>
      <p>謝謝您的訂閱！</p>
      <p>最新的美食訊息，將不定時寄送到您的電子信箱</p>
    </template>
    <template #modal-footer>
      <button type="button" class="w-50 btn btn-primary" @click="handleSubscriptionModal(false)">
        關閉
      </button>
    </template>
  </AlertModal>
</template>
