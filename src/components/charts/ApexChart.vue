<template>
  <div class="chart-container">
    <apexchart :type="type" :series="series" :options="options" :height="height"></apexchart>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

const props = defineProps({
  type: {
    type: String,
    default: 'line',
  },
  series: {
    type: Array,
    default: () => [],
  },
  options: {
    type: Object,
    default: () => ({}),
  },
  height: {
    type: String,
    default: '350',
  },
});
</script>

<style>
.chart-container {
  width: 100%;
}
</style>
