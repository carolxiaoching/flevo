<script setup lang="ts">
  import { computed } from 'vue';
  import { Swiper, SwiperSlide } from 'swiper/vue';
  import { Autoplay, Pagination, Navigation, FreeMode, EffectCreative } from 'swiper/modules';
  import 'swiper/css';
  import 'swiper/css/free-mode';
  import 'swiper/css/navigation';
  import 'swiper/css/pagination';
  import type { Recipe } from '@/types/front/recipe';

  type Props = {
    recipes?: Recipe[];
  };
  type RecipeDefault = Pick<Recipe, '_id' | 'title' | 'coverImgUrl' | 'description'>;

  const props = withDefaults(defineProps<Props>(), {
    recipes: () => [],
  });
  const defaultRecipes: RecipeDefault[] = [
    {
      _id: 'placeholder-loading',
      title: '',
      coverImgUrl: '',
      description: '',
    },
  ];
  const recommendRecipes = computed<RecipeDefault[]>(() => {
    if (props.recipes.length === 0) {
      return defaultRecipes;
    }
    return props.recipes.slice(0, 4);
  });

  // Swiper 配置
  const modules = [Autoplay, Pagination, Navigation, FreeMode, EffectCreative];
  const heroSwiperOptions = {
    modules: modules,
    effect: 'creative',
    creativeEffect: {
      prev: {
        rotate: [0, 0, 40],
        scale: 0.4,
        opacity: 0,
      },
      next: {
        rotate: [0, 0, -30],
        scale: 0.4,
        opacity: 0,
      },
    },
    // 核心控制
    slidesPerView: 1,
    centeredSlides: true,
    // 自動播放
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    // 效能與監聽
    observer: true,
    observeParents: true,
    watchSlidesProgress: true,
    // 分頁器
    pagination: {
      el: '.heroSwiperPagination',
      bulletClass: 'heroSwiperBullet',
      bulletActiveClass: 'heroSwiperBulletActive',
      clickable: true,
    },
  };
</script>

<template>
  <div class="position-relative">
    <Swiper v-bind="heroSwiperOptions" :loop="recommendRecipes.length > 1">
      <SwiperSlide v-for="item in recommendRecipes" :key="item._id">
        <div v-if="!item._id" class="text-muted">載入中...</div>
        <router-link :to="`/recipe/${item._id}`" class="d-block" v-else>
          <div
            class="heroSwiperCover backgroundCover"
            :style="{ backgroundImage: `url(${item?.coverImgUrl})` }"
          ></div>
          <div class="heroSwiperTitle">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="heroSwiperSvg">
              <defs>
                <path
                  id="circlePath"
                  d="M 100, 100 m -80, 0 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0"
                />
              </defs>

              <circle cx="100" cy="100" r="65" class="heroSwiperSvgBg" />

              <text
                x="100"
                y="105"
                text-anchor="middle"
                dominant-baseline="middle"
                class="heroSwiperSvgTitle"
              >
                {{ item?.title?.slice(0, 6) }}{{ item?.title?.length > 6 ? '...' : '' }}
              </text>

              <text class="heroSwiperSvgCircleText">
                <textPath href="#circlePath">
                  Flavor & Fuel • Flevo • Flavor & Fuel • Flevo •
                </textPath>
              </text>
            </svg>
          </div>
        </router-link>
      </SwiperSlide>
    </Swiper>
    <div class="heroSwiperPagination z-99" />
  </div>
</template>
