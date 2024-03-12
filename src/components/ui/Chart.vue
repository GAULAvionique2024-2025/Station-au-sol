<script setup>
import { onMounted, ref, watch } from 'vue';
import { useDataStore } from '@/stores/data.js';

import { ChartConfig } from './ChartConfig.js';
import { Chart } from 'chart.js/auto';

const props = defineProps({
  maxData: {
    type: Number,
    default: 500
  }
});

let mychart;
const chartjs = ref(null);

onMounted(() => {
  mychart = new Chart(chartjs.value, ChartConfig);
})

const { dataList } = useDataStore();

watch(dataList, (newDataList, _) => {
  updateChart(newDataList);
})

function updateChart(newDataList) {
  const truncatedDataList = newDataList.slice(-props.maxData);

  mychart.data.labels = truncatedDataList.map(data => data.time);
  mychart.data.datasets[0] = {
    label: "ALT",
    data: truncatedDataList.map(data => data.altitude),
  }
  mychart.data.datasets[1] = {
    label: "SPD",
    data: truncatedDataList.map(data => data.speed),
    yAxisID: 'y1',
  }
  mychart.data.datasets[2] = {
    label: "ACC",
    data: truncatedDataList.map(data => data.acceleration),
    yAxisID: 'y1',
  }

  mychart.update();
}
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