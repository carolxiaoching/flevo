<script setup lang="ts">
  import { computed } from 'vue';
  import type { ApexOptions } from 'apexcharts';
  import VueApexCharts from 'vue3-apexcharts';

  const props = withDefaults(
    defineProps<{
      labels: string[];
      series: number[];
      chartType?: 'pie' | 'donut';
    }>(),
    {
      labels: () => [],
      series: () => [],
      chartType: 'donut',
    },
  );

  const chartOptions = computed<ApexOptions>(() => ({
    chart: {
      type: props.chartType,
      toolbar: { show: false },
    },
    labels: props.labels,
    legend: {
      position: 'bottom',
      fontSize: '13px',
    },
    dataLabels: {
      enabled: true,
      formatter(val: number) {
        return `${val.toFixed(1)}%`;
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: { position: 'bottom' },
        },
      },
    ],
  }));
</script>

<template>
  <VueApexCharts height="300" :options="chartOptions" :series="series" />
</template>
