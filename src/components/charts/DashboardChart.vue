<template>
  <div class="chart-container">
    <div class="chart-header">
      <div class="chart-info">
        <div class="info-section">
          <span class="info-title">Production</span>
          <span class="info-value">245.3 KWh</span>
        </div>
        <div class="info-section">
          <span class="info-title">Data Logs</span>
          <span class="info-value">150.5 K</span>
        </div>
      </div>
      <button @click="toggleChartPeriod">
        {{ currentPeriod === 'week' ? '1 Month' : '1 Week' }}
      </button>
    </div>
    <apexchart :options="chartOptions" :series="chartSeries" type="line"></apexchart>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import chartData from '@/data/dashboardChart.json';

const chartSeries = ref([]);
const chartOptions = ref({
  chart: {
    id: 'dashboard-chart',
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  xaxis: {
    labels: {
      show: false,
    },
    categories: [],
  },
  yaxis: {
    labels: {
      show: false,
    },
  },
  grid: {
    show: false,
  },

  //colors: ['#555557'],
});

const currentPeriod = ref('week');

const toggleChartPeriod = () => {
  if (currentPeriod.value === 'week') {
    currentPeriod.value = 'month';
    chartSeries.value = chartData.monthData.series;
    chartOptions.value.xaxis.categories = chartData.monthData.categories;
  } else {
    currentPeriod.value = 'week';
    chartSeries.value = chartData.weekData.series;
    chartOptions.value.xaxis.categories = chartData.weekData.categories;
  }
};

chartSeries.value = chartData.weekData.series;
chartOptions.value.xaxis.categories = chartData.weekData.categories;
</script>

<style lang="scss" scoped>
.chart-container {
  background-color: #d9d9d9;
}
.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  padding: 1rem;
}
.chart-info {
  display: flex;

  .info-section {
    margin-right: 2rem;
  }
  .info-title {
    display: block;
  }
  .info-value {
    display: block;
    font-weight: 900;
  }
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
}
</style>
