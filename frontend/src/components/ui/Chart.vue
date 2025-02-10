<script setup>
import { onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useDataStore } from "@/stores/data.js";
import { useSettingsStore } from "@/stores/settings.js";
import { ChartConfig } from "./ChartConfig.js";
import { Chart } from "chart.js/auto";

const { chartMaxDataPoints } = storeToRefs(useSettingsStore());

let mychart;
const chartjs = ref(null);

onMounted(() => {
  mychart = new Chart(chartjs.value, ChartConfig);
  mychart.resize();
});

const { dataList, currentData } = storeToRefs(useDataStore());

watch(currentData, (newData, _) => {
  if (Object.keys(newData).length !== 0) {
    updateChart(newData);
  } else {
    resetChart();
  }
});

function updateChart(newData) {
  if (mychart.data.labels.length > chartMaxDataPoints.value) {
    mychart.data.labels.shift();
    mychart.data.datasets[0].data.shift();
    mychart.data.datasets[1].data.shift();
    mychart.data.datasets[2].data.shift();
  }

  if (!newData.time) return;

  mychart.data.labels.push(newData.time);
  mychart.data.datasets[0].data.push(newData.altitude);
  mychart.data.datasets[1].data.push(newData.speed);
  mychart.data.datasets[2].data.push(newData.acceleration);

  
  mychart.update();
}

function updateChartCheckbox(datasetIndex) {
  const isDataShown = mychart.isDatasetVisible(datasetIndex);

  if (isDataShown === false) {
    mychart.show(datasetIndex);
  } else {
    mychart.hide(datasetIndex);
  }

  mychart.update();
}

function resetChart() {
  mychart.data.labels = [];
  mychart.data.datasets[0].data = [];
  mychart.data.datasets[1].data = [];
  mychart.data.datasets[2].data = [];
  mychart.update();
}

watch(chartMaxDataPoints, (newMaxDataPoints) => {
  const truncatedDataList = dataList.value.slice(-newMaxDataPoints);

  mychart.data.labels = truncatedDataList.map((data) => data.time);
  mychart.data.datasets[0].data = truncatedDataList.map((data) => data.altitude);
  mychart.data.datasets[1].data = truncatedDataList.map((data) => data.speed);
  mychart.data.datasets[2].data = truncatedDataList.map((data) => data.acceleration);

  mychart.update();
});
</script>

<template>
  <div id="chart-container">
    <div id = "checkbox">
      <label>
        ALT
      <input type="checkbox" @click="updateChartCheckbox(0)" checked /> 
      </label>
      <label>
        SPD
      
    <input type="checkbox" @click="updateChartCheckbox(1)" checked />
  </label>
  <label>
    ACC
    <input type="checkbox" @click="updateChartCheckbox(2)" checked /> 
    
  </label>
    </div>
    <canvas ref="chartjs"></canvas>
    

  </div>
</template>

v<style lang="scss" scoped>
@use "@/assets/scss/variables" as *;


#chart-container {
  display: flex;
  width:900px;
  height:350px;
  justify-content: flex-start;
}

#checkbox {
  display:flex;
  flex-direction: column;
  gap:100px;
  justify-content: flex-start;
  padding:10px;
  font-size:1.5rem;
}

input[type="checkbox"]{
  width: 25px;
  height: 25px; 
  transform: scale(0.7); 
  cursor: pointer;
}
</style>

