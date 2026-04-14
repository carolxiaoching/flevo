<script setup lang="ts">
  import { ref, onMounted, useTemplateRef } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useRoute, useRouter } from 'vue-router';
  import { apiGetRecipe, apiCreateRecipe, apiUpdateRecipe } from '@/api/front/recipes';
  import AlertModal from '@/components/AlertModal.vue';
  import RecipeFormBasics from '@/components/front/RecipeFormBasics.vue';
  import RecipeFormIngredients from '@/components/front/RecipeFormIngredients.vue';
  import RecipeFormSteps from '@/components/front/RecipeFormSteps.vue';
  import RecipeFormSubmit from '@/components/front/RecipeFormSubmit.vue';
  import { loadingStore, messageStore, tagAndCategoryStore, userStore } from '@/stores';
  import type { RecipeDetail, RecipeFormData } from '@/types/front/recipe';
  import type { AppErrorResponse } from '@/types/common';

  const router = useRouter();
  const route = useRoute();
  const userRef = userStore();
  const tagAndCategoryRef = tagAndCategoryStore();
  const { myProfile } = storeToRefs(userRef);
  const { categories, tags } = storeToRefs(tagAndCategoryRef);
  const { getTagsAndCategories } = tagAndCategoryRef;
  const { openLoading, closeLoading } = loadingStore();
  const { pushMessage } = messageStore();

  const step = ref<number>(1);
  const recipe = ref<Partial<RecipeDetail>>({});
  const alertModalRef = useTemplateRef<InstanceType<typeof AlertModal>>('alertModalRef');
  const submitErrorMsg = ref<string>('');
  const tempRecipe = ref<RecipeFormData>({
    nutritionFacts: {
      calories: 0,
      protein: 0,
      totalFat: 0,
      totalCarb: 0,
      sodium: 0,
      sugar: 0,
    },
    title: '',
    coverImgUrl: '',
    isPublic: false,
    category: '',
    cookingTime: '0-15 分鐘',
    description: '',
    servings: 1,
    ingredients: [{ ingredientName: '', ingredientQty: '' }],
    steps: [{ stepContent: '' }],
    note: '',
    tags: [],
  });

  async function submitRecipe() {
    submitErrorMsg.value = '';
    tempRecipe.value.steps.forEach((item, index) => {
      item.stepOrder = index + 1;
    });

    const id = recipe.value._id;
    const msg = id ? '更新' : '新增';

    try {
      openLoading();
      if (id) {
        await apiUpdateRecipe(id, tempRecipe.value);
      } else {
        await apiCreateRecipe(tempRecipe.value);
      }
      alertModalRef.value?.openModal();
      closeLoading();
    } catch (err) {
      const errText = (err as AppErrorResponse).message || `${msg}失敗，請重整網頁`;
      pushMessage({ style: 'danger', title: `${msg}失敗`, text: errText });
      submitErrorMsg.value = errText;
      closeLoading();
    }
  }

  async function closeSuccessModal() {
    await alertModalRef.value?.hideModal();
    router.push('/recipes');
  }

  async function getRecipe(id: string) {
    openLoading();
    try {
      const res = await apiGetRecipe(id);
      recipe.value = { ...res.data?.data };
      tempRecipe.value = JSON.parse(JSON.stringify(res.data?.data));

      if (recipe.value.user?._id !== myProfile.value._id) {
        pushMessage({ style: 'danger', title: '權限不足', text: '您無法編輯他人的食譜' });
        router.push('/recipes');
      }
      closeLoading();
    } catch (err) {
      pushMessage({
        style: 'danger',
        title: '載入失敗',
        text: (err as AppErrorResponse).message || '載入失敗，請重整網頁',
      });
      closeLoading();
    }
  }

  onMounted(async () => {
    if (!tags.value.length || !categories.value.length) {
      await getTagsAndCategories();
    }
    const { id } = route.params;
    if (typeof id === 'string' && id !== 'new') {
      await getRecipe(id);
    }
  });
</script>

<template>
  <div class="container-fluid">
    <div class="row justify-content-center py-17">
      <!-- ── Step Nav ── -->
      <ul class="list-unstyled d-flex justify-content-center mb-16 p-0 col-12">
        <li
          class="stepProgressItem active position-relative me-lg-17 px-14 py-8 rounded-3 text-center"
          :class="{ stepProgressActive: step === 1 }"
        >
          <span class="d-block fw-medium">STEP 1</span>
          封面與資料
        </li>
        <li
          class="stepProgressItem position-relative me-lg-17 px-14 py-8 rounded-3 text-center"
          :class="{ active: step > 1, stepProgressActive: step === 2 }"
        >
          <span class="d-block fw-medium">STEP 2</span>
          成分與食材
          <span class="stepProgressLine d-none d-lg-block w-100 z-n1"></span>
        </li>
        <li
          class="stepProgressItem position-relative me-lg-17 px-14 py-8 rounded-3 text-center"
          :class="{ active: step > 2, stepProgressActive: step === 3 }"
        >
          <span class="d-block fw-medium">STEP 3</span>
          步驟與備註
          <span class="stepProgressLine d-none d-lg-block w-100 z-n1"></span>
        </li>
        <li
          class="stepProgressItem position-relative me-lg-17 px-14 py-8 rounded-3 text-center"
          :class="{ active: step === 4, stepProgressActive: step === 4 }"
        >
          <span class="d-block fw-medium">STEP 4</span>
          確認與送出
          <span class="stepProgressLine d-none d-lg-block w-100 z-n1"></span>
        </li>
      </ul>

      <!-- ── STEP 1 ── -->
      <VForm v-if="step === 1" class="col-12 col-xxl-8" @submit="step = 2">
        <RecipeFormBasics v-model="tempRecipe" :categories="categories" :tags="tags" />
        <div class="d-flex flex-column flex-md-row align-items-center">
          <router-link to="/recipes" class="btn btn-outline-primary w-100 mb-8 mb-md-0 me-md-16">
            <i class="bi bi-arrow-90deg-left me-8"></i>返回食譜列表
          </router-link>
          <button type="submit" class="btn btn-primary w-100">下一步</button>
        </div>
      </VForm>

      <!-- ── STEP 2 ── -->
      <VForm v-if="step === 2" class="col-12 col-xxl-8" @submit="step = 3">
        <RecipeFormIngredients v-model="tempRecipe" />
        <div class="d-flex flex-column flex-md-row align-items-center">
          <button
            type="button"
            class="btn btn-outline-primary w-100 mb-8 mb-md-0 me-md-16"
            @click="step = 1"
          >
            <i class="bi bi-arrow-90deg-left me-8"></i>上一步
          </button>
          <button type="submit" class="btn btn-primary w-100">下一步</button>
        </div>
      </VForm>

      <!-- ── STEP 3 ── -->
      <VForm v-if="step === 3" class="col-12 col-xxl-8" @submit="step = 4">
        <RecipeFormSteps v-model="tempRecipe" />
        <div class="d-flex flex-column flex-md-row align-items-center">
          <button
            type="button"
            class="btn btn-outline-primary w-100 mb-8 mb-md-0 me-md-16"
            @click="step = 2"
          >
            <i class="bi bi-arrow-90deg-left me-8"></i>上一步
          </button>
          <button type="submit" class="btn btn-primary w-100">下一步</button>
        </div>
      </VForm>

      <!-- ── STEP 4：確認與送出 ── -->
      <div v-if="step === 4" class="col-12 col-xxl-8">
        <RecipeFormSubmit
          v-model="tempRecipe"
          :recipe="recipe"
          :categories="categories"
          :tags="tags"
        />

        <div class="alert alert-danger mb-16" role="alert" v-if="submitErrorMsg">
          {{ submitErrorMsg }}
        </div>
        <div class="d-flex flex-column flex-md-row align-items-center">
          <button
            type="button"
            class="btn btn-outline-primary w-100 mb-8 mb-md-0 me-md-16"
            @click="step = 3"
          >
            <i class="bi bi-arrow-90deg-left me-8"></i>上一步
          </button>
          <button type="button" class="btn btn-primary w-100" @click="submitRecipe">
            {{ recipe._id ? '更新食譜' : '新增食譜' }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <AlertModal ref="alertModalRef">
    <template #modal-header>{{ recipe._id ? '更新' : '新增' }}成功</template>
    <template #modal-content>
      恭喜 {{ recipe._id ? '更新' : '新增' }}成功，將為您導入食譜列表頁面
    </template>
    <template #modal-footer>
      <button type="button" class="w-50 btn btn-primary" @click="closeSuccessModal">關閉</button>
    </template>
  </AlertModal>
</template>
