<!-- Chart used by the MyChart component -->

<script setup>
import { onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useDataStore } from '@/stores/data.js';
import { useSettingsStore } from '@/stores/settings.js';

import { ChartConfig } from './ChartConfig.js';
import { Chart } from 'chart.js/auto';

const { chartMaxDataPoints } = storeToRefs(useSettingsStore());

let mychart;
const chartjs = ref(null);

onMounted(() => {
  mychart = new Chart(chartjs.value, ChartConfig);
})

const { dataList, currentData } = storeToRefs(useDataStore());

watch(currentData, (newData, _) => {
  if (Object.keys(newData).length !== 0) {
    updateChart(newData);
  } else {
    resetChart();
  }
})

function updateChart(newData) {
  if (mychart.data.labels.length > chartMaxDataPoints.value) {
    mychart.data.labels.shift();
    mychart.data.datasets[0].data.shift();
    mychart.data.datasets[1].data.shift();
    mychart.data.datasets[2].data.shift();
  }

  mychart.data.labels.push(newData.time);
  mychart.data.datasets[0].data.push(newData.altitude);
  mychart.data.datasets[1].data.push(newData.speed);
  mychart.data.datasets[2].data.push(newData.acceleration);

  mychart.update();
}

function resetChart() {
  mychart.data.labels = [];
  mychart.data.datasets[0].data = [];
  mychart.data.datasets[1].data = [];
  mychart.data.datasets[2].data = [];
  mychart.update();
}

// Resize chart when the chartMaxDataPoints setting is changed
watch(chartMaxDataPoints, (newMaxDataPoints, _) => {
  const truncatedDataList = dataList.value.slice(-newMaxDataPoints);

  mychart.data.labels = truncatedDataList.map(data => data.time);
  mychart.data.datasets[0].data = truncatedDataList.map(data => data.altitude);
  mychart.data.datasets[1].data = truncatedDataList.map(data => data.speed);
  mychart.data.datasets[2].data = truncatedDataList.map(data => data.acceleration);

  mychart.update();
})

</script>

<template>
  <div>
    <canvas ref="chartjs"></canvas>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/variables' as *;

div {
  @media screen and (min-width: 0px) and (max-width: calc($layout-breakpoint-sm - 0.2px)) {
    width: 95vw;
    min-width: calc($min-width - 16px);
  }
}
</style>