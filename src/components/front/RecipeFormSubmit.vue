<script setup lang="ts">
  import { getCategoryName, getTagName } from '@/utils/dataMap';
  import type { Category } from '@/types/front/category';
  import type { Tag } from '@/types/front/tag';
  import type { RecipeFormData, RecipeDetail } from '@/types/front/recipe';

  type Props = {
    recipe: Partial<RecipeDetail>;
    categories: Category[];
    tags: Tag[];
  };

  withDefaults(defineProps<Props>(), {
    recipe: () => ({}),
    categories: () => [],
    tags: () => [],
  });

  const tempRecipe = defineModel<RecipeFormData>({ required: true });
</script>

<template>
  <div class="table-responsive mb-16 p-14 p-md-16 bg-white rounded shadow-sm">
    <table class="table recipeTable">
      <tbody>
        <tr>
          <th scope="row" width="150" class="d-none d-sm-table-cell text-nowrap">食譜封面</th>
          <td class="text-center text-sm-start">
            <img v-lazy="tempRecipe.coverImgUrl" class="img-thumbnail" style="max-width: 160px" />
          </td>
        </tr>
        <tr>
          <th scope="row" width="150" class="d-none d-sm-table-cell text-nowrap">食譜名稱</th>
          <td>{{ tempRecipe.title }}</td>
        </tr>
        <tr v-if="recipe._id">
          <th scope="row" width="150" class="d-none d-sm-table-cell text-nowrap">食譜 ID</th>
          <td>{{ recipe._id }}</td>
        </tr>
        <tr>
          <th scope="row" width="150" class="d-none d-sm-table-cell text-nowrap">食譜分類</th>
          <td>{{ getCategoryName(categories, tempRecipe.category) }}</td>
        </tr>
        <tr v-if="tempRecipe.tags?.length">
          <th scope="row" width="150" class="d-none d-sm-table-cell text-nowrap">食譜標籤</th>
          <td class="d-flex flex-wrap">
            <div class="me-4 fs-5" v-for="tagItem in tempRecipe.tags" :key="tagItem">
              <span class="badge text-bg-secondary text-white">{{
                getTagName(tags, tagItem)
              }}</span>
            </div>
          </td>
        </tr>
        <tr>
          <th scope="row" width="150" class="d-none d-sm-table-cell text-nowrap">烹飪時間</th>
          <td>{{ tempRecipe.cookingTime }}</td>
        </tr>
        <tr>
          <th scope="row" width="150" class="d-none d-sm-table-cell text-nowrap">食譜份量</th>
          <td>{{ tempRecipe.servings }} 人份</td>
        </tr>
        <tr>
          <th scope="row" width="150" class="d-none d-sm-table-cell text-nowrap">食譜描述</th>
          <td>{{ tempRecipe.description }}</td>
        </tr>
        <tr>
          <th scope="row" width="150" class="d-none d-sm-table-cell text-nowrap">是否公開</th>
          <td class="fs-5">
            <span
              class="badge"
              :class="{
                'text-bg-primary  text-white': tempRecipe.isPublic,
                'text-bg-light': !tempRecipe.isPublic,
              }"
            >
              {{ tempRecipe.isPublic ? '公開' : '私人' }}
            </span>
          </td>
        </tr>
        <tr>
          <th scope="row" width="150" class="d-none d-sm-table-cell text-nowrap">營養成分</th>
          <td>
            <ul class="list-unstyled mb-0">
              <li>總卡路里：{{ tempRecipe.nutritionFacts?.calories }}</li>
              <li>蛋白質：{{ tempRecipe.nutritionFacts?.protein }}</li>
              <li>總脂肪：{{ tempRecipe.nutritionFacts?.totalFat }}</li>
              <li>碳水化合物：{{ tempRecipe.nutritionFacts?.totalCarb }}</li>
              <li>鹽：{{ tempRecipe.nutritionFacts?.sodium }}</li>
              <li>糖：{{ tempRecipe.nutritionFacts?.sugar }}</li>
            </ul>
          </td>
        </tr>
        <tr>
          <th scope="row" width="150" class="d-none d-sm-table-cell text-nowrap">食材</th>
          <td>
            <ul class="list-unstyled mb-0">
              <li v-for="(item, index) in tempRecipe.ingredients" :key="`ingredients${index}`">
                {{ item.ingredientName }} {{ item.ingredientQty }}
              </li>
            </ul>
          </td>
        </tr>
        <tr>
          <th scope="row" width="150" class="d-none d-sm-table-cell text-nowrap">步驟</th>
          <td>
            <ul class="list-unstyled mb-0">
              <li v-for="(item, index) in tempRecipe.steps" :key="`steps${index}`">
                STEP {{ index + 1 }}： {{ item.stepContent }}
              </li>
            </ul>
          </td>
        </tr>
        <tr>
          <th scope="row" width="150" class="d-none d-sm-table-cell text-nowrap">小撇步</th>
          <td>{{ tempRecipe.note || '無' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
