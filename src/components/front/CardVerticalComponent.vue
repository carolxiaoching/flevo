<script setup lang="ts">
  import { getCategoryName } from '@/utils/dataMap';
  import type { Recipe } from '@/types/front/recipe';
  import type { Tag } from '@/types/front/tag';
  import type { Category } from '@/types/front/category';

  type Props = {
    recipe?: Recipe;
    categories?: Category[];
    tags?: Tag[];
    collects?: string[];
    mode?: string;
  };

  withDefaults(defineProps<Props>(), {
    recipe: () => ({
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
      isRecommended: false,
    }),
    categories: () => [],
    tags: () => [],
    collects: () => [],
    mode: 'collect',
  });

  const emit = defineEmits<{
    'toggle-collect': [{ active: 'create' | 'remove'; recipeId: string }];
    'open-del-modal': [{ id: string; title: string }];
  }>();
</script>

<template>
  <div
    class="d-flex flex-column flex-md-row position-relative mb-12 p-11 bg-white rounded-2 shadow-sm"
  >
    <div class="cardVerticalCollect d-block" v-if="mode === 'collect'">
      <a
        href="#"
        class="cardVerticalCollectBtn d-block px-6 py-4 rounded-circle text-danger"
        v-if="collects.includes(recipe._id)"
        @click.prevent="emit('toggle-collect', { active: 'remove', recipeId: recipe._id })"
      >
        <i class="bi bi-heart-fill"></i>
      </a>
      <a
        href="#"
        class="cardVerticalCollectBtn d-block px-6 py-4 rounded-circle"
        v-else
        @click.prevent="emit('toggle-collect', { active: 'create', recipeId: recipe._id })"
      >
        <i class="bi bi-heart"></i>
      </a>
    </div>
    <div class="cardVerticalCollect d-block" v-else>
      <a
        href="#"
        class="cardVerticalDelBtn d-block px-6 py-4 rounded-circle text-white"
        @click.prevent="emit('open-del-modal', { id: recipe._id, title: recipe.title })"
      >
        <i class="bi bi-trash"></i>
      </a>
    </div>
    <div
      class="cardVerticalCover backgroundCover mb-11 mb-md-0 me-md-11 rounded-2"
      :style="{ backgroundImage: `url(${recipe.coverImgUrl})` }"
    ></div>
    <div class="flex-fill text-center text-md-start">
      <div class="d-inline-block mb-8 px-6 py-2 bg-secondary rounded-2 text-white">
        <small>
          {{ getCategoryName(categories, recipe.category) }}
        </small>
      </div>
      <h5 class="mb-2">
        {{ recipe.title }}
      </h5>
      <router-link :to="`/user/${recipe.user?._id}`" class="link-muted d-block mb-6">
        {{ recipe.user?.nickName }}
      </router-link>
      <p class="textClamp textClampSm textLsSm mb-8 text-muted overflow-hidden">
        {{ recipe.description }}
      </p>
      <div class="text-center text-md-end">
        <router-link
          :to="`/recipe-edit/${recipe._id}`"
          class="btn btn-sm btn-outline-primary me-8 px-11"
          v-if="mode === 'edit'"
        >
          編輯食譜
        </router-link>
        <router-link :to="`/recipe/${recipe._id}`" class="btn btn-sm btn-primary px-11">
          查看更多
        </router-link>
      </div>
    </div>
  </div>
</template>
