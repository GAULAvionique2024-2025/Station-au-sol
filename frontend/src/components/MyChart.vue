<script setup>
import Chart from "./ui/Chart.vue";
import { storeToRefs } from "pinia";
import { useDataStore } from "@/stores/data";
import { useSettingsStore } from "@/stores/settings.js";

const { currentData } = storeToRefs(useDataStore());
const { showChart, showAltitude, showSpeed, showAcceleration } = storeToRefs(useSettingsStore());
const settings = useSettingsStore;
</script>

<template>
  <div id="chart" class="component double">
    <div class="flex-container">
      <div class="sidebar">
        <div>
          <input type="checkbox" id="showAltitude" v-model="settings.showAltitude" />
          <label for="showAltitude">ALT</label>
        </div>
        <div>
          <input type="checkbox" id="showSpeed" v-model="settings.showSpeed" />
          <label for="showSpeed">SPD</label>
        </div>
        <div>
          <input type="checkbox" id="showAcceleration" v-model="settings.showAcceleration" />
          <label for="showAcceleration"> ACC </label>
        </div>
      </div>

      <div class="main-content">
        <div class="value-grid">
          <div class="value">
            <h5>ALT</h5>
            <div>
              <h3>
                {{ currentData && currentData.altitude !== null && currentData.altitude !== undefined && Number(currentData.altitude) < 99999.9 ? Number(currentData.altitude).toFixed(1) : "???" }}
                m
              </h3>
              <h5>
                {{ currentData && currentData.altitude_ft !== null && currentData.altitude_ft !== undefined && Number(currentData.altitude_ft) < 999999.9 ? Number(currentData.altitude_ft).toFixed(1) : "???" }}
                ft.
              </h5>
            </div>
          </div>
          <div class="value">
            <h5>SPD</h5>
            <h3>
              {{ currentData && currentData.speed !== null && currentData.speed !== undefined && Number(currentData.speed) < 99999.9 ? Number(currentData.speed).toFixed(1) : "???" }}
              m/s
            </h3>
          </div>
          <div class="value">
            <h5>ACC</h5>
            <h3>
              {{ currentData && currentData.acceleration !== null && currentData.acceleration !== undefined && Number(currentData.acceleration) < 99999.9 ? Number(currentData.acceleration).toFixed(1) : "???" }}
              m/s²
            </h3>
          </div>
        </div>
        <Chart v-if="showChart" />
      </div>
    </div>
  </div>
</template>

<style scoped>
#chart {
  display: flex;
  height: 100vh;
  width:100%;
  flex-direction: row;

.flex-container {
  display: flex;
  flex-direction: row; 
  width: 100%;
}

.sidebar {
  width: 200px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center; 
  gap: 1rem;
  height: 500px;
  justify-content: center;
}
.checkbox{
  height:50px;
  display:flex;
  align-items:flex-end;
}

.sidebar > div {
  margin-bottom: 2rem;
}

.sidebar label {
  font-size: 1.5rem; 
}

.main-content {
  flex-grow: 1;
  padding: 1rem;
  overflow-y: auto;
}

.value-grid {
  display: flex;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  justify-content: center;
  gap: 5rem;
  width: 100%;
}

.value h5 {
  font-size: 1rem; 
}

.value h3 {
  font-size: 1.5rem;
}

.value {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

input[type="checkbox"] {
  margin-right: 0.5rem;
  transform:scale(2);
}
}
</style>

