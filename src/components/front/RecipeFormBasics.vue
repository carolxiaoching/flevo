<script setup lang="ts">
  import { useFormErrors } from 'vee-validate';
  import UploadComponent from '@/components/front/UploadComponent.vue';
  import type { Category } from '@/types/front/category';
  import type { Tag } from '@/types/front/tag';
  import type { RecipeFormData } from '@/types/front/recipe';

  type Props = {
    categories: Category[];
    tags: Tag[];
  };

  const tempRecipe = defineModel<RecipeFormData>({ required: true });

  withDefaults(defineProps<Props>(), {
    categories: () => [],
    tags: () => [],
  });

  const errors = useFormErrors();
</script>

<template>
  <!-- 食譜封面 -->
  <div
    class="d-flex flex-column mb-16 p-14 p-md-16 bg-white rounded shadow-sm"
    :class="{ 'border border-danger': errors['食譜封面'] }"
    tabindex="0"
  >
    <h2 class="title mb-2">
      <span class="titleIcon bg-secondary-subtle">
        <i class="bi bi-image"></i>
      </span>
      <span> 食譜封面</span>
      <span class="text-danger fs-6">(必填) </span>
    </h2>
    <p class="mb-11 text-center text-muted">
      <small> （圖片限制在 1 MB 以下） </small>
    </p>

    <VField
      type="text"
      id="coverImgUrl"
      class="d-none"
      name="食譜封面"
      v-model="tempRecipe.coverImgUrl"
      rules="required"
      required
    />
    <ErrorMessage name="食譜封面" v-slot="{ message }">
      <p class="mb-4 text-center text-danger">{{ message }}</p>
    </ErrorMessage>
    <div class="mx-lg-16">
      <UploadComponent
        :temp-image-url="tempRecipe.coverImgUrl"
        imageType="photo"
        @update-image="url => (tempRecipe.coverImgUrl = url)"
      />
    </div>
  </div>

  <!-- 基本設定 -->
  <div class="p-14 p-md-16 bg-white rounded shadow-sm mb-16">
    <h2 class="title mb-11">
      <span class="titleIcon bg-secondary-subtle">
        <i class="bi bi-file-earmark-text"></i>
      </span>
      <span> 基本設定 </span>
    </h2>
    <div class="d-flex align-items-center mb-8">
      <label for="isPublic" class="form-label mb-0 me-16" style="min-width: 200px">
        是否公開食譜：
      </label>
      <div class="form-check form-switch ps-0">
        <input
          class="form-check-input"
          type="checkbox"
          role="switch"
          id="isPublic"
          v-model="tempRecipe.isPublic"
          :true-value="true"
          :false-value="false"
        />
        <label class="form-check-label align-middle" for="isPublic">
          {{ tempRecipe.isPublic ? '目前為公開食譜' : '目前為私人食譜' }}
        </label>
      </div>
    </div>
  </div>

  <!-- 基本資料 -->
  <div class="mb-16 p-14 p-md-16 bg-white rounded shadow-sm">
    <h2 class="title mb-11">
      <span class="titleIcon bg-secondary-subtle">
        <i class="bi bi-file-earmark-text"></i>
      </span>
      <span> 基本資料 </span>
      <span class="text-danger fs-6">(必填) </span>
    </h2>
    <div class="row g-8">
      <div class="col-12">
        <label for="title" class="form-label"> 食譜標題： </label>
        <VField
          type="text"
          placeholder="食譜標題"
          id="title"
          class="form-control"
          name="食譜標題"
          :class="{ 'is-invalid': errors['食譜標題'] }"
          v-model="tempRecipe.title"
          rules="min:2|max:10|required"
          required
        />
        <ErrorMessage name="食譜標題" class="invalid-feedback" />
      </div>
      <div class="col-12 col-md-4">
        <label for="category" class="form-label"> 食譜分類： </label>
        <VField
          as="select"
          name="食譜分類"
          id="category"
          class="form-select"
          :class="{ 'is-invalid': errors['食譜分類'] }"
          rules="required"
          v-model="tempRecipe.category"
          required
        >
          <option value="" selected disabled>請選擇食譜分類</option>
          <option
            :value="categoryItem._id"
            v-for="categoryItem in categories"
            :key="categoryItem._id"
          >
            {{ categoryItem.title }}
          </option>
        </VField>
        <ErrorMessage name="食譜分類" class="invalid-feedback" />
      </div>
      <div class="col-12 col-md-4">
        <label for="cookingTime" class="form-label"> 烹飪時長： </label>
        <VField
          as="select"
          name="烹飪時長"
          id="cookingTime"
          class="form-select"
          :class="{ 'is-invalid': errors['烹飪時長'] }"
          rules="required"
          v-model="tempRecipe.cookingTime"
          required
        >
          <option value="" selected disabled>請選擇烹飪時長</option>
          <option value="0-15 分鐘">0-15 分鐘</option>
          <option value="15-30 分鐘">15-30 分鐘</option>
          <option value="30 分鐘以上">30-60 分鐘</option>
          <option value="60 分鐘以上">60 分鐘以上</option>
        </VField>
        <ErrorMessage name="烹飪時長" class="invalid-feedback" />
      </div>
      <div class="col-12 col-md-4">
        <label for="servings" class="form-label"> 烹飪份量： </label>
        <VField
          as="select"
          name="烹飪份量"
          id="servings"
          class="form-select"
          :class="{ 'is-invalid': errors['烹飪份量'] }"
          rules="required"
          v-model="tempRecipe.servings"
          required
        >
          <option :value="n" v-for="n in 8" :key="`servings${n}`">{{ n }} 人份</option>
        </VField>
        <ErrorMessage name="烹飪份量" class="invalid-feedback" />
      </div>
      <div class="col-12">
        <label for="description" class="form-label"> 食譜簡介： </label>
        <VField
          as="textarea"
          id="description"
          rows="3"
          placeholder="請輸入食譜簡介"
          class="form-control"
          name="食譜簡介"
          :class="{ 'is-invalid': errors['食譜簡介'] }"
          v-model="tempRecipe.description"
          rules="min:2|max:150|required"
          required
        />
        <ErrorMessage name="食譜簡介" class="invalid-feedback" />
      </div>
    </div>
  </div>

  <!-- 標籤 -->
  <div
    class="mb-16 p-14 p-md-16 bg-white rounded shadow-sm"
    :class="{ 'border border-danger': errors['食譜標籤'] }"
  >
    <h2 class="title mb-11">
      <span class="titleIcon bg-secondary-subtle">
        <i class="bi bi-bookmarks-fill"></i>
      </span>
      <span> 標籤 </span>
      <span class="text-muted fs-6">(選填) </span>
    </h2>
    <div class="mx-lg-16 text-center">
      <div class="d-sm-inline-block m-2" v-for="item in tags" :key="item._id">
        <VField
          name="食譜標籤"
          type="checkbox"
          class="btn-check"
          :id="item._id"
          :value="item._id"
          v-model="tempRecipe.tags"
          rules="maxTagArrayLength:3"
        />
        <label :for="item._id" class="btn btn-outline-secondary w-100 text-nowrap">
          {{ item.title }}
        </label>
      </div>
      <ErrorMessage name="食譜標籤" v-slot="{ message }">
        <p class="mt-8 text-danger">{{ message }}</p>
      </ErrorMessage>
    </div>
  </div>
</template>
