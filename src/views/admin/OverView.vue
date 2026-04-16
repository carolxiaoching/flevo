<script setup lang="ts">
  import { ref, computed, onBeforeMount } from 'vue';
  import { apiAdminGetUsers } from '@/api/admin/adminUsers';
  import { apiAdminGetRecipes } from '@/api/admin/adminRecipes';
  import { apiAdminGetCategories } from '@/api/admin/adminCategories';
  import { apiAdminGetTags } from '@/api/admin/adminTags';
  import { loadingStore, messageStore } from '@/stores/admin';
  import { getCategoryName } from '@/utils/dataMap';
  import { getTime } from '@/utils/date';
  import AreaChartComponent from '@/components/admin/AreaChart.vue';
  import PieChartComponent from '@/components/admin/PieChart.vue';
  import BarChartComponent from '@/components/admin/BarChart.vue';
  import type { AppErrorResponse } from '@/types/common';
  import type { AdminUserDetail } from '@/types/admin/adminUser';
  import type { AdminRecipe } from '@/types/admin/adminRecipe';
  import type { AdminTag } from '@/types/admin/adminTag';
  import type { AdminCategory } from '@/types/admin/adminCategory';

  const loadingRef = loadingStore();
  const messageRef = messageStore();
  const { openLoading, closeLoading } = loadingRef;
  const { pushMessage } = messageRef;

  const users = ref<AdminUserDetail[]>([]);
  const recipes = ref<AdminRecipe[]>([]);
  const categories = ref<AdminCategory[]>([]);
  const tags = ref<AdminTag[]>([]);

  // 統計卡片
  const statCards = computed(() => {
    const now = new Date();
    const thisYear = now.getFullYear();
    const thisMonth = now.getMonth();

    const newUsersThisMonth = users.value.filter(u => {
      const d = new Date(u.createdAt);
      return d.getFullYear() === thisYear && d.getMonth() === thisMonth;
    }).length;

    const publicRecipes = recipes.value.filter(r => r.isPublic).length;

    return [
      {
        icon: 'bi bi-people-fill',
        color: 'bg-primary-subtle text-primary',
        name: '會員人數',
        num: users.value.length,
        unit: '人',
        sub: `本月新增 ${newUsersThisMonth} 人`,
      },
      {
        icon: 'bi bi-cookie',
        color: 'bg-success-subtle text-success',
        name: '食譜數量',
        num: recipes.value.length,
        unit: '篇',
        sub: `公開 ${publicRecipes} 篇`,
      },
      {
        icon: 'bi bi-columns-gap',
        color: 'bg-warning-subtle text-warning',
        name: '分類數量',
        num: categories.value.length,
        unit: '個',
        sub: `已使用 ${categories.value.filter(c => recipes.value.some(r => r.category === c._id)).length} 個`,
      },
      {
        icon: 'bi bi-bookmarks-fill',
        color: 'bg-danger-subtle text-danger',
        name: '標籤數量',
        num: tags.value.length,
        unit: '個',
        sub: `已使用 ${new Set(recipes.value.flatMap(r => r.tags)).size} 個`,
      },
    ];
  });

  // 分類圓餅圖
  const categoryPieLabels = computed(() => categories.value.map(c => c.title));
  const categoryPieSeries = computed(() => {
    return categories.value.map(cat => {
      return recipes.value.filter(r => r.category === cat._id).length;
    });
  });

  // 烹飪時間環形圖
  const cookingTimeLabels = ['0-15 分鐘', '15-30 分鐘', '30-60 分鐘', '60 分鐘以上'];
  const cookingTimeSeries = computed(() => {
    return [
      recipes.value.filter(r => r.cookingTime === '0-15 分鐘').length,
      recipes.value.filter(r => r.cookingTime === '15-30 分鐘').length,
      recipes.value.filter(r => r.cookingTime === '30 分鐘以上').length,
      recipes.value.filter(r => r.cookingTime === '60 分鐘以上').length,
    ];
  });

  // 各分類食譜長條圖
  const barCategories = computed(() => categories.value.map(c => c.title));
  const barSeries = computed(() => [
    {
      name: '食譜數量',
      data: categories.value.map(cat => recipes.value.filter(r => r.category === cat._id).length),
    },
  ]);

  // 取得初始資料
  async function getInitData() {
    try {
      openLoading();
      const [membersRes, recipesRes, categoriesRes, tagsRes] = await Promise.all([
        apiAdminGetUsers(),
        apiAdminGetRecipes(),
        apiAdminGetCategories(),
        apiAdminGetTags(),
      ]);
      users.value = membersRes.data.data;
      recipes.value = recipesRes.data.data;
      categories.value = categoriesRes.data.data;
      tags.value = tagsRes.data.data;
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

  onBeforeMount(() => {
    getInitData();
  });
</script>

<template>
  <div class="container-fluid">
    <!-- 標題 -->
    <div class="d-flex align-items-center justify-content-between mb-14">
      <h1 class="h3 mb-0">控制台</h1>
      <span class="text-muted fs-6">
        <i class="bi bi-calendar3 me-4"></i>
        {{
          new Date().toLocaleDateString('zh-TW', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
          })
        }}
      </span>
    </div>

    <!-- 統計卡片 -->
    <div class="row g-8 g-lg-16 mb-16">
      <div class="col-6 col-lg-3" v-for="(card, index) in statCards" :key="index">
        <div class="d-flex align-items-center gap-11 p-11 bg-white rounded shadow-sm h-100">
          <div
            class="flex-shrink-0 d-flex align-items-center justify-content-center rounded-circle"
            :class="card.color"
            style="width: 56px; height: 56px"
          >
            <i class="fs-4" :class="card.icon"></i>
          </div>
          <div class="overflow-hidden">
            <p class="mb-2 text-muted small text-truncate">{{ card.name }}</p>
            <p class="mb-0 fw-bold fs-4 lh-1">
              {{ card.num }}
              <span class="fs-6 fw-normal text-muted">{{ card.unit }}</span>
            </p>
            <p class="mb-0 mt-2 small text-muted text-truncate">{{ card.sub }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 食譜增長面積圖 -->
    <div class="row g-8 g-lg-16 mb-16">
      <div class="col-12">
        <div class="p-16 bg-white rounded shadow-sm">
          <h2 class="title mb-11">
            <span class="titleIcon bg-success-subtle">
              <i class="bi bi-graph-up-arrow text-success"></i>
            </span>
            <span>食譜增長趨勢</span>
          </h2>
          <AreaChartComponent :categories="categories" :recipes="recipes" />
        </div>
      </div>
    </div>

    <!-- 圖表區：圓餅圖 + 環形圖 + 長條圖 -->
    <div class="row g-8 g-lg-16 mb-16">
      <!-- 分類比例圓餅圖 -->
      <div class="col-12 col-lg-4">
        <div class="h-100 p-16 bg-white rounded shadow-sm">
          <h2 class="title mb-11">
            <span class="titleIcon bg-warning-subtle">
              <i class="bi bi-columns-gap text-warning"></i>
            </span>
            <span>食譜分類比例</span>
          </h2>
          <PieChartComponent
            :labels="categoryPieLabels"
            :series="categoryPieSeries"
            chart-type="pie"
          />
        </div>
      </div>

      <!-- 烹飪時間環形圖 -->
      <div class="col-12 col-lg-4">
        <div class="h-100 p-16 bg-white rounded shadow-sm">
          <h2 class="title mb-11">
            <span class="titleIcon bg-danger-subtle">
              <i class="bi bi-clock-history text-danger"></i>
            </span>
            <span>烹飪時間分布</span>
          </h2>
          <PieChartComponent
            :labels="cookingTimeLabels"
            :series="cookingTimeSeries"
            chart-type="donut"
          />
        </div>
      </div>

      <!-- 各分類食譜長條圖 -->
      <div class="col-12 col-lg-4">
        <div class="h-100 p-16 bg-white rounded shadow-sm">
          <h2 class="title mb-11">
            <span class="titleIcon bg-primary-subtle">
              <i class="bi bi-bar-chart-fill text-primary"></i>
            </span>
            <span>各分類食譜數</span>
          </h2>
          <BarChartComponent :categories="barCategories" :series="barSeries" />
        </div>
      </div>
    </div>

    <!-- 最新會員 & 最新食譜 -->
    <div class="row g-8 g-lg-16">
      <!-- 最新會員 -->
      <div class="col-12 col-lg-6">
        <div class="h-100 p-16 bg-white rounded shadow-sm">
          <div class="d-flex align-items-end mb-11">
            <h2 class="title">
              <span class="titleIcon bg-primary-subtle">
                <i class="bi bi-people-fill text-primary"></i>
              </span>
              <span>最新會員</span>
            </h2>
            <div class="d-none d-md-block ms-auto">
              <router-link to="/dashboard/users" class="link-primary text-decoration-underline">
                看更多
                <i class="bi bi-arrow-right-short"></i>
              </router-link>
            </div>
          </div>
          <div class="table-responsive">
            <table class="table align-middle mb-0">
              <thead>
                <tr class="table-active">
                  <th class="text-center">會員</th>
                  <th class="text-center">身份</th>
                  <th class="d-none d-md-table-cell text-center">加入日期</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in users.slice(0, 5)" :key="item._id">
                  <td>
                    <div class="d-flex align-items-center gap-8">
                      <img
                        v-if="item.avatarImgUrl"
                        v-lazy="item.avatarImgUrl"
                        class="thumbnail rounded-circle flex-shrink-0"
                      />
                      <div
                        v-else
                        class="thumbnail rounded-circle flex-shrink-0 bg-secondary-subtle d-flex align-items-center justify-content-center"
                      >
                        <i class="bi bi-person-fill text-muted"></i>
                      </div>
                      <div class="overflow-hidden">
                        <p class="mb-0 text-truncate fw-medium">{{ item.nickName }}</p>
                        <p class="mb-0 text-muted small text-truncate">{{ item.email }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="text-center">
                    <span
                      class="badge"
                      :class="
                        item.role === 'admin'
                          ? 'bg-danger-subtle text-danger'
                          : 'bg-secondary-subtle text-secondary'
                      "
                    >
                      {{ item.role === 'admin' ? '管理員' : '一般會員' }}
                    </span>
                  </td>
                  <td class="d-none d-md-table-cell text-center text-muted small">
                    {{ getTime(item.createdAt) }}
                  </td>
                </tr>
                <tr v-if="users.length === 0">
                  <td colspan="3" class="text-center text-muted py-16">暫無資料</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 最新食譜 -->
      <div class="col-12 col-lg-6">
        <div class="h-100 p-16 bg-white rounded shadow-sm">
          <div class="d-flex align-items-end mb-11">
            <h2 class="title">
              <span class="titleIcon bg-success-subtle">
                <i class="bi bi-cookie text-success"></i>
              </span>
              <span>最新食譜</span>
            </h2>
            <div class="d-none d-md-block ms-auto">
              <router-link to="/dashboard/recipes" class="link-primary text-decoration-underline">
                看更多
                <i class="bi bi-arrow-right-short"></i>
              </router-link>
            </div>
          </div>
          <div class="table-responsive">
            <table class="table align-middle mb-0">
              <thead>
                <tr class="table-active">
                  <th class="text-center">食譜名稱</th>
                  <th class="d-none d-md-table-cell text-center">分類</th>
                  <th class="text-center">狀態</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in recipes.slice(0, 5)" :key="item._id">
                  <td>
                    <div class="d-flex align-items-center gap-8">
                      <img
                        v-if="item.coverImgUrl"
                        v-lazy="item.coverImgUrl"
                        class="thumbnail flex-shrink-0"
                      />
                      <div
                        v-else
                        class="thumbnail flex-shrink-0 bg-secondary-subtle d-flex align-items-center justify-content-center"
                      >
                        <i class="bi bi-image text-muted"></i>
                      </div>
                      <p class="mb-0 text-truncate fw-medium">{{ item.title }}</p>
                    </div>
                  </td>
                  <td class="d-none d-md-table-cell text-center">
                    <span class="badge bg-warning-subtle text-warning">
                      {{ getCategoryName(categories, item.category) }}
                    </span>
                  </td>
                  <td class="text-center">
                    <span
                      class="badge"
                      :class="
                        item.isPublic
                          ? 'bg-success-subtle text-success'
                          : 'bg-secondary-subtle text-secondary'
                      "
                    >
                      {{ item.isPublic ? '公開' : '私密' }}
                    </span>
                  </td>
                </tr>
                <tr v-if="recipes.length === 0">
                  <td colspan="3" class="text-center text-muted py-16">暫無資料</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
