<script setup lang="ts">
  import { computed } from 'vue';
  import type { ApexOptions } from 'apexcharts';
  import VueApexCharts from 'vue3-apexcharts';

  const props = withDefaults(
    defineProps<{
      categories: string[];
      series: { name: string; data: number[] }[];
    }>(),
    {
      categories: () => [],
      series: () => [],
    },
  );

  const chartOptions = computed<ApexOptions>(() => ({
    chart: {
      type: 'bar',
      toolbar: { show: false },
    },
    xaxis: {
      categories: props.categories,
      labels: {
        style: { fontSize: '13px' },
        rotate: -30,
        hideOverlappingLabels: true,
        trim: true, // 過長文字裁切
        maxHeight: 60,
      },
    },
    yaxis: {
      min: 0,
      tickAmount: 4,
      labels: {
        formatter: (val: number) => Math.floor(val).toString(),
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
        borderRadius: 4,
        borderRadiusApplication: 'end',
      },
    },
    dataLabels: { enabled: false },
    legend: { position: 'top' },
    grid: {
      borderColor: '#f1f1f1',
    },
    colors: ['#5bc0de', '#f0ad4e', '#d9534f', '#5cb85c', '#9B59B6', '#1ABC9C'],
  }));
</script>

<template>
  <VueApexCharts height="300" :options="chartOptions" :series="series" />
</template>
