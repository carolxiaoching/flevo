<script setup lang="ts">
  import { onMounted, ref, useTemplateRef } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useRoute, useRouter } from 'vue-router';
  import { apiGetRecipe, apiGetRecipes } from '@/api/front/recipes';
  import { messageStore, loadingStore, tagAndCategoryStore, userStore } from '@/stores';
  import { getCategoryName, getTagName } from '@/utils/dataMap';
  import { getTime } from '@/utils/date';
  import AlertModal from '@/components/AlertModal.vue';
  import CardComponent from '@/components/front/CardComponent.vue';
  import type { Recipe, RecipeDetail } from '@/types/front/recipe';
  import type { AppErrorResponse } from '@/types/common';

  const route = useRoute();
  const router = useRouter();
  const loadingRef = loadingStore();
  const messageRef = messageStore();
  const userRef = userStore();
  const tagAndCategoryRef = tagAndCategoryStore();
  const { openLoading, closeLoading } = loadingRef;
  const { pushMessage } = messageRef;
  const { getTagsAndCategories } = tagAndCategoryRef;
  const { toggleCollect } = userRef;
  const { myProfile } = storeToRefs(userRef);
  const { categories, tags } = storeToRefs(tagAndCategoryRef);
  const recipe = ref<RecipeDetail>({
    _id: '',
    title: '',
    coverImgUrl: '',
    isPublic: false,
    category: '',
    user: {
      _id: '',
      nickName: '',
      avatarImgUrl: '',
    },
    cookingTime: '0-15 分鐘',
    description: '',
    servings: 0,
    createdAt: '',
    updatedAt: '',
    tags: [],
    collectsCount: 0,
    ingredients: [
      {
        ingredientName: '',
        ingredientQty: '',
      },
    ],
    nutritionFacts: {
      calories: 0,
      protein: 0,
      totalFat: 0,
      totalCarb: 0,
      sodium: 0,
      sugar: 0,
    },
    steps: [
      {
        stepContent: '',
      },
    ],
    note: '',
  });
  const recipes = ref<Recipe[]>([]);
  const alertModalRef = useTemplateRef<InstanceType<typeof AlertModal>>('alertModalRef');

  // 關閉 modal
  function closeAlertModal() {
    alertModalRef.value?.hideModal();
    router.push('/recipes');
  }

  // 取得食譜資料
  async function getRecipe(id: string) {
    openLoading();

    try {
      const res = await apiGetRecipe(id);
      recipe.value = res.data.data;

      await getRelatedRecipes(recipe.value.category);

      closeLoading();
    } catch (err) {
      pushMessage({
        style: 'danger',
        title: '載入失敗',
        text: (err as AppErrorResponse)?.message || '食譜載入失敗，請重整網頁',
      });
      closeLoading();
      router.push('/recipes');
    }
  }

  // 取得關聯食譜資料
  async function getRelatedRecipes(category: string) {
    openLoading();

    try {
      const res = await apiGetRecipes({ category });
      recipes.value = res.data.data.results;

      closeLoading();
    } catch (err) {
      pushMessage({
        style: 'danger',
        title: '載入失敗',
        text: (err as AppErrorResponse)?.message || '相關食譜載入失敗，請重整網頁',
      });
      closeLoading();
    }
  }

  // 即時更新收藏狀態
  async function handleCollect({
    active,
    recipeId,
  }: {
    active: 'create' | 'remove';
    recipeId: string;
  }) {
    await toggleCollect({ active, recipeId });
    recipe.value.collectsCount += active === 'create' ? 1 : -1;
  }

  onMounted(async () => {
    const { id } = route.params;
    if (id && typeof id === 'string') {
      if (!tags.value.length || !categories.value.length) {
        await getTagsAndCategories();
      }
      await getRecipe(id);
    } else {
      alertModalRef.value?.openModal();
    }
  });
</script>

<template>
  <div class="row">
    <div class="col-12 py-8">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <router-link to="/recipes"> 所有食譜 </router-link>
          </li>
          <li class="breadcrumb-item">
            <router-link :to="`/recipes?category=${recipe.category}`">
              {{ getCategoryName(categories, recipe.category) }}
            </router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">洋蔥炒牛肉</li>
        </ol>
      </nav>
    </div>
    <div class="col-12 col-md-6 col-xl-7 mb-11 mb-md-16">
      <div
        class="recipeCover backgroundCover w-100 h-100 rounded-2"
        :style="{ backgroundImage: `url(${recipe.coverImgUrl})` }"
        :alt="recipe.title"
        v-if="recipe.coverImgUrl"
      ></div>
    </div>
    <div class="col-12 col-md-6 col-xl-5 mb-16">
      <div class="position-relative p-16 bg-white shadow-sm rounded">
        <a
          href="#"
          class="collectBtn position-absolute top-0 end-0 p-14 text-primary fs-4"
          v-if="myProfile.collects?.includes(recipe._id)"
          @click.prevent="handleCollect({ active: 'remove', recipeId: recipe._id })"
        >
          <i class="bi bi-heart-fill"></i>
        </a>
        <a
          href="#"
          class="collectBtn position-absolute top-0 end-0 p-14 text-primary fs-4"
          v-else
          @click.prevent="handleCollect({ active: 'create', recipeId: recipe._id })"
        >
          <i class="bi bi-heart"></i>
        </a>
        <router-link :to="`/recipes?category=${recipe.category}`" class="d-block mb-4">
          {{ getCategoryName(categories, recipe.category) }}
        </router-link>
        <h1 class="mb-11">{{ recipe.title }}</h1>
        <ul class="list-unstyled mb-11">
          <li class="mb-2">
            <i class="bi bi-person-fill me-4"></i>
            作者：
            <router-link :to="`/user/${recipe.user?._id}`" class="link-muted">
              {{ recipe.user?.nickName }}
            </router-link>
          </li>
          <li class="mb-2">
            <i class="bi bi-calendar3 me-4"></i>
            建立日期：{{ getTime(recipe.createdAt) }}
          </li>
          <li class="mb-2">
            <i class="bi bi-calendar3 me-4"></i>
            更新日期：{{ getTime(recipe.updatedAt) }}
          </li>
          <li class="mb-2">
            <i class="bi bi-bookmark-heart me-4"></i>
            收藏人數：{{ recipe.collectsCount }}
          </li>
          <li>
            <i class="bi bi-clock-history me-4"></i>
            烹飪時長：{{ recipe.cookingTime }}
          </li>
        </ul>
        <p class="textClamp textClampLg textLsSm text-muted">
          {{ recipe.description }}
        </p>
        <ul class="list-unstyled mt-11 mb-0" v-if="recipe.tags?.length">
          <li v-for="tag in recipe.tags" :key="tag" class="d-inline-block me-2">
            <span class="badge text-bg-secondary text-white fs-6">{{ getTagName(tags, tag) }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="col-12 col-lg-6 mb-16">
      <h2 class="title justify-content-start mb-11">
        <span class="titleIcon bg-secondary-subtle">
          <i class="bi bi-people-fill"></i>
        </span>
        <span class="me-6"> 食材 </span>
        <span class="fs-5 text-muted">({{ recipe.servings }} 人份)</span>
      </h2>
      <ul class="row list-unstyled mb-0">
        <li
          class="col-12 col-sm-6"
          v-for="(ingredientItem, index) in recipe.ingredients"
          :key="`ingredient${index}`"
        >
          <p class="d-flex justify-content-between py-4 border-bottom">
            <span> {{ ingredientItem.ingredientName }} </span>
            <span>{{ ingredientItem.ingredientQty }}</span>
          </p>
        </li>
      </ul>
    </div>
    <div class="col-12 col-lg-6 mb-16">
      <h2 class="title justify-content-start mb-11">
        <span class="titleIcon bg-secondary-subtle">
          <i class="bi bi-people-fill"></i>
        </span>
        <span> 營養成分 </span>
      </h2>
      <ul class="row list-unstyled mb-0">
        <li class="col-12 col-sm-6">
          <p class="d-flex justify-content-between py-4 border-bottom">
            <span> 總熱量 </span>
            <span>{{ recipe.nutritionFacts?.calories }} 大卡</span>
          </p>
        </li>
        <li class="col-12 col-sm-6">
          <p class="d-flex justify-content-between py-4 border-bottom">
            <span> 蛋白質 </span>
            <span>{{ recipe.nutritionFacts?.protein }} 克</span>
          </p>
        </li>
        <li class="col-12 col-sm-6">
          <p class="d-flex justify-content-between py-4 border-bottom">
            <span> 碳水化合物 </span>
            <span>{{ recipe.nutritionFacts?.totalCarb }} 克</span>
          </p>
        </li>
        <li class="col-12 col-sm-6">
          <p class="d-flex justify-content-between py-4 border-bottom">
            <span> 總脂肪 </span>
            <span>{{ recipe.nutritionFacts?.totalFat }} 克</span>
          </p>
        </li>
        <li class="col-12 col-sm-6">
          <p class="d-flex justify-content-between py-4 border-bottom">
            <span> 醣類 </span>
            <span>{{ recipe.nutritionFacts?.sugar }} 克</span>
          </p>
        </li>
        <li class="col-12 col-sm-6">
          <p class="d-flex justify-content-between py-4 border-bottom">
            <span> 鹽 </span>
            <span>{{ recipe.nutritionFacts?.sodium }} 克</span>
          </p>
        </li>
      </ul>
    </div>
    <div class="col-12 mb-16">
      <h2 class="title justify-content-start mb-11">
        <span class="titleIcon bg-secondary-subtle">
          <i class="bi bi-people-fill"></i>
        </span>
        <span> 步驟 </span>
      </h2>
      <div class="step mx-auto">
        <ul class="stepList list-unstyled position-relative m-0 p-0">
          <li
            class="stepItem position-relative"
            v-for="(stepItem, index) in recipe.steps"
            :key="`step${index}`"
          >
            <div class="stepOrder px-8 py-4 bg-secondary rounded-circle text-white fw-bold">
              {{ stepItem.stepOrder }}
            </div>
            <div class="ms-17 ms-md-23 p-11 bg-white rounded-2 shadow-sm">
              {{ stepItem.stepContent }}
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="col-12 mb-16">
      <h2 class="title justify-content-start mb-11">
        <span class="titleIcon bg-secondary-subtle">
          <i class="bi bi-people-fill"></i>
        </span>
        <span> 小撇步 </span>
      </h2>
      <div class="textLsSm text-muted">{{ recipe.note || '無' }}</div>
    </div>
    <div class="col-12 mb-17">
      <h2 class="title justify-content-start mb-11">
        <span class="titleIcon bg-secondary-subtle">
          <i class="bi bi-people-fill"></i>
        </span>
        <span> 更多料理選擇 </span>
      </h2>
      <div class="row row-cols-1 row-cols-md-2 row-cols-xxl-3 gy-14 mb-11" v-if="recipes.length">
        <div class="col" v-for="item in recipes.slice(0, 3)" :key="item._id">
          <CardComponent
            :recipe="item"
            :categories="categories"
            :tags="tags"
            :collects="myProfile.collects"
            @toggle-collect="handleCollect"
          ></CardComponent>
        </div>
      </div>
    </div>
  </div>

  <AlertModal ref="alertModalRef">
    <template #modal-header>
      <span class="titleIcon bg-danger-subtle">
        <i class="bi bi-exclamation-triangle-fill"></i>
      </span>
      找不到此食譜
    </template>
    <template #modal-content> 找不到此食譜，將為您導入食譜列表頁面 </template>
    <template #modal-footer>
      <button type="button" class="w-50 btn btn-primary" @click="closeAlertModal">關閉</button>
    </template>
  </AlertModal>
</template>
