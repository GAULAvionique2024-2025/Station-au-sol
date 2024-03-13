<script setup>
import Chart from './ui/Chart.vue';

import { storeToRefs } from 'pinia';
import { useDataStore } from '@/stores/data';
import { useSettingsStore } from '@/stores/settings.js';

const { currentData } = storeToRefs(useDataStore());
const { showChart } = storeToRefs(useSettingsStore());
</script>

<template>
  <div id="chart" class="component double">
    <div class="value-grid">
      <div class="value">
        <h5>ALT</h5>
        <h3>{{ currentData && currentData.altitude ? currentData.altitude : "???" }} m</h3>
      </div>
      <div class="value">
        <h5>SPD</h5>
        <h3>{{ currentData && currentData.speed ? currentData.speed : "???" }} m/s</h3>
      </div>
      <div class="value">
        <h5>ACC</h5>
        <h3>{{ currentData && currentData.acceleration ? currentData.acceleration : "???" }} m/s²</h3>
      </div>
    </div>
    <Chart v-if="showChart"></Chart>
  </div>
</template>