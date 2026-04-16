<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useRoute, useRouter } from 'vue-router';
  import CardComponent from '@/components/front/CardComponent.vue';
  import PaginationComponent from '@/components/PaginationComponent.vue';
  import { apiGetRecipes } from '@/api/front/recipes';
  import { messageStore, loadingStore, tagAndCategoryStore, userStore } from '@/stores/front';
  import type { Recipe } from '@/types/front/recipe';
  import type { AppErrorResponse, Pagination } from '@/types/common';

  type Filter = {
    sort?: string;
    category?: string;
    keyword?: string;
    // tagId 陣列
    tags?: string[];
    page?: number;
  };

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

  const recipes = ref<Recipe[]>([]);
  const pagination = ref<Pagination>({
    totalPage: 0,
    currentPage: 0,
    hasPrev: false,
    hasNext: false,
  });

  const filter = ref<Filter>({
    sort: 'desc',
    category: '全部',
    keyword: '',
    tags: [],
    page: 1,
  });
  const keyword = ref<string>('');

  // 更新篩選條件
  function updateFilter(newFilter: Filter) {
    filter.value = { ...filter.value, ...newFilter };
    getRecipes();
  }

  // 監聽 route.query 的變化，動態更新 filter
  watch(
    () => route.query,
    async newQuery => {
      if (newQuery) {
        if (!tags.value.length || !categories.value.length) {
          await getTagsAndCategories();
        }

        const { keyword, category, tag } = route.query;

        if (keyword || category || tag) {
          filter.value = {
            sort: 'desc',
            category: typeof category === 'string' ? category : '全部',
            keyword: typeof keyword === 'string' ? keyword : '',
            tags: tag ? [`${tag}`] : [],
            page: 1,
          };
        }

        getRecipes();
      }
    },
    { immediate: true }, // 初始時也會執行一次
  );

  // 關鍵字搜尋
  async function search() {
    const query = route.query;
    if (query.keyword) {
      router.replace('/recipes');
    }

    const keywordValue: string = keyword.value.trim();
    if (!keywordValue) {
      pushMessage({
        style: 'warning',
        title: '請輸入關鍵字',
        text: '請輸入關鍵字',
      });
      return;
    }

    updateFilter({
      keyword: keywordValue,
      category: '全部',
      tags: [],
      page: 1,
    });

    // 清空搜尋 input
    keyword.value = '';
  }

  // 清除搜尋
  async function cleanSearch() {
    const query = route.query;
    if (query.keyword) {
      router.replace('/recipes');
    }

    updateFilter({
      keyword: '',
      category: '全部',
      tags: [],
      page: 1,
    });
  }

  // 分類搜尋
  function setCategory(category: string) {
    const query = route.query;
    if (query.category) {
      router.replace('/recipes');
    }

    updateFilter({ category });
  }

  // 切換標籤
  function toggleTag(tag: string) {
    const query = route.query;
    if (query.tag) {
      filter.value.tags = [];
      router.replace('/recipes');
    }

    // 限制最大選擇的標籤數量為 3
    const filterTags: string[] = filter.value.tags || [];
    if (filterTags.length >= 3 && !filterTags.includes(tag)) {
      pushMessage({
        style: 'warning',
        title: '標籤數量限制',
        text: '最多只能選擇3個標籤',
      });
      return;
    }

    const index: number = filterTags.indexOf(tag);
    if (index > -1) {
      filterTags.splice(index, 1);
    } else {
      filterTags.push(tag);
    }
    updateFilter({ tags: filterTags, page: 1 });
  }

  // 排序
  function toggleSort(sort: string) {
    updateFilter({ sort, page: 1 });
  }

  // 換頁
  function changePage(page: number) {
    updateFilter({ page });
  }

  // 取得食譜列表
  async function getRecipes() {
    openLoading();
    try {
      const recipesRes = await apiGetRecipes(filter.value);
      recipes.value = recipesRes.data.data.results;
      pagination.value = recipesRes.data.data.pagination;

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
</script>

<template>
  <div class="py-17">
    <div class="recipesBanner mx-auto mb-17 rounded-2">
      <div
        class="recipesBannerOverLay d-flex justify-content-center align-items-center position-absolute top-0 bottom-0 start-0 end-0 p-8"
      >
        <div class="recipesBannerContent text-center text-white">
          <h2 class="recipesBannerTitle mb-14 lh-base">
            美味相伴
            <span class="d-block">讓忙碌的生活更有滋味</span>
          </h2>
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              placeholder="請輸入關鍵字"
              aria-label="請輸入關鍵字"
              aria-describedby="search"
              v-model="keyword"
              @keyup.enter="search"
            />
            <button
              class="btn btn-secondary text-white"
              type="button"
              id="search"
              @click.prevent="search"
            >
              搜尋
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-12 col-xl-3">
        <h5 class="sidebarTitle">分類</h5>
        <ul class="sidebarList">
          <li class="">
            <a
              href="#"
              class="sidebarLink"
              :class="{ active: filter.category == '全部' }"
              @click.prevent="setCategory('全部')"
            >
              全部
            </a>
          </li>
          <li class="" v-for="item in categories" :key="item._id">
            <a
              href="#"
              class="sidebarLink"
              :class="{ active: filter.category == item._id }"
              @click.prevent="setCategory(item._id)"
            >
              {{ item.title }}
            </a>
          </li>
        </ul>

        <h5 class="sidebarTitle">
          標籤
          <span class="text-dark-emphasis fs-6">( 只能選3個 )</span>
        </h5>
        <ul class="sidebarTags">
          <li v-for="item in tags" :key="item._id">
            <a
              href="#"
              class="sidebarTagsLink"
              :class="{ sidebarTagsLinkActive: filter.tags?.includes(item._id) }"
              @click.prevent="toggleTag(item._id)"
            >
              {{ item.title }}
            </a>
          </li>
        </ul>
      </div>
      <div class="col-12 col-xl-9 d-flex flex-column">
        <div class="d-flex mb-14">
          <div class="toolbarFilterText me-4" v-if="filter.keyword !== ''">
            <a href="#" class="badge text-bg-primary text-white fs-6" @click.prevent="cleanSearch">
              {{ filter.keyword }}
              <i class="bi bi-x"></i>
            </a>
          </div>
          <div class="toolbarFilterTags" v-if="filter.keyword !== ''">
            共 {{ recipes.length }} 筆
          </div>
          <div class="toolbarSort ms-auto">
            <a
              href="#"
              class="me-8"
              :class="{ 'link-secondary': filter.sort === 'desc' }"
              @click.prevent="toggleSort('desc')"
            >
              <span>
                <i class="bi bi-arrow-down"></i>
                新到舊
              </span>
            </a>
            <a
              href="#"
              class="me-8"
              :class="{ 'link-secondary': filter.sort === 'asc' }"
              @click.prevent="toggleSort('asc')"
            >
              <span>
                <i class="bi bi-arrow-up"></i>
                舊到新
              </span>
            </a>
            <a
              href="#"
              :class="{ 'link-secondary': filter.sort === 'hot' }"
              @click.prevent="toggleSort('hot')"
            >
              <span>
                <i class="bi bi-fire"></i>
                熱門度
              </span>
            </a>
          </div>
        </div>
        <div
          v-if="recipes.length === 0"
          class="flex-fill d-flex justify-content-center align-items-center me-4"
        >
          <p class="fs-3 text-dark-emphasis">
            <em>沒有符合條件的食譜</em>
          </p>
        </div>
        <div class="row row-cols-1 row-cols-md-2 row-cols-xxl-3 gy-14 mb-11" v-else>
          <div class="col" v-for="item in recipes" :key="item._id">
            <CardComponent
              :recipe="item"
              :categories="categories"
              :tags="tags"
              :collects="myProfile.collects"
              @toggle-collect="toggleCollect"
              mode="collect"
            ></CardComponent>
          </div>
        </div>
        <div class="mt-14" v-if="pagination.totalPage">
          <PaginationComponent :pagination="pagination" @update-page="changePage" />
        </div>
      </div>
    </div>
  </div>
</template>
