<script setup lang="ts">
  import { ref, computed } from 'vue';
  import type { ApexOptions } from 'apexcharts';
  import VueApexCharts from 'vue3-apexcharts/core';
  import 'apexcharts/line';
  import { getCategoryName } from '@/utils/dataMap';
  import { getMonthArray } from '@/utils/date';
  import type { AdminRecipe } from '@/types/admin/adminRecipe';
  import type { AdminCategory } from '@/types/admin/adminCategory';

  const props = withDefaults(
    defineProps<{
      categories: AdminCategory[];
      recipes: AdminRecipe[];
    }>(),
    {
      categories: () => [],
      recipes: () => [],
    },
  );

  const monthArray = getMonthArray();

  const chartOptions = ref<ApexOptions>({
    chart: {
      height: '100px',
      type: 'area',
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    dataLabels: { enabled: true },
    tooltip: { enabled: false },
    xaxis: {
      categories: monthArray.map(item => `${item.year}/${item.month}`),
      tickAmount: 6, // 限制最多顯示幾個刻度
      labels: {
        rotate: -45, // 標籤旋轉避免重疊
        rotateAlways: false,
        hideOverlappingLabels: true, // 自動隱藏重疊標籤
      },
    },
  });

  const series = computed<{ name: string; data: number[] }[]>(() => {
    const newSeries = props.categories.map(category => ({
      name: category.title,
      data: Array.from({ length: monthArray.length }, () => 0),
    }));

    props.recipes.forEach(recipe => {
      const date = new Date(recipe.createdAt);
      const memberYear = date.getFullYear();
      const memberMonth = date.getMonth() + 1;
      const categoryName = getCategoryName(props.categories as never[], recipe.category);
      const categoryIndex = newSeries.findIndex(item => item.name === categoryName);

      if (categoryIndex !== -1) {
        const index = monthArray.findIndex(
          item => item.year === memberYear && item.month === memberMonth,
        );
        const targetEntry = newSeries[categoryIndex];
        if (index !== -1 && targetEntry) {
          targetEntry.data[index] = (targetEntry.data[index] ?? 0) + 1;
        }
      }
    });

    return newSeries;
  });
</script>

<template>
  <VueApexCharts height="320" :options="chartOptions" :series="series" />
</template>
