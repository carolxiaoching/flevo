<script setup lang="ts">
  import { getCategoryName, getTagName } from '@/utils/dataMap';
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
    mode: '',
  });

  const emit = defineEmits<{
    'toggle-collect': [{ active: 'create' | 'remove'; recipeId: string }];
  }>();
</script>

<template>
  <router-link
    :to="`/recipe/${recipe._id}`"
    class="cardWrapper d-block mb-8 mb-xl-5 p-11 bg-white rounded-4 overflow-hidden"
    :class="{ 'h-100': mode !== 'home' }"
  >
    <div class="mb-8 text-muted">
      <small>
        {{ getCategoryName(categories, recipe.category) }}
      </small>
    </div>

    <div class="position-relative text-center">
      <div v-if="!recipe.coverImgUrl" class="cardImg" />
      <img v-else v-lazy="recipe.coverImgUrl" class="cardImg" :alt="recipe.title" />

      <div class="cardCollect" v-if="mode === 'collect'">
        <a
          href="#"
          class="cardCollectBtn d-block py-4 px-6 rounded-circle text-danger"
          v-if="collects.includes(recipe._id)"
          @click.prevent="emit('toggle-collect', { active: 'remove', recipeId: recipe._id })"
        >
          <i class="bi bi-heart-fill"></i>
        </a>
        <a
          href="#"
          class="cardCollectBtn d-block py-4 px-6 rounded-circle"
          v-else
          @click.prevent="emit('toggle-collect', { active: 'create', recipeId: recipe._id })"
        >
          <i class="bi bi-heart"></i>
        </a>
      </div>
    </div>

    <div class="">
      <h4 class="mb-1">{{ recipe.title }}</h4>
      <p v-if="recipe.user && mode !== 'home'" class="text-muted">
        <small>
          {{ recipe.user?.nickName }}
        </small>
      </p>
      <hr class="cardDivider" />
      <p class="cardDesc mb-4 text-muted">
        <small>
          {{ recipe.description }}
        </small>
      </p>
      <ul class="list-unstyled mb-0" v-if="recipe.tags?.length && mode !== 'home'">
        <li v-for="tag in recipe.tags" :key="tag" class="d-inline-block me-2">
          <span class="badge text-bg-secondary text-white">{{ getTagName(tags, tag) }}</span>
        </li>
      </ul>
    </div>
  </router-link>
</template>
