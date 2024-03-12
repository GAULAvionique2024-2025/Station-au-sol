<script setup>
import Chart from './ui/Chart.vue';

import { storeToRefs } from 'pinia';
import { useDataStore } from '@/stores/data';

const { currentData } = storeToRefs(useDataStore());
</script>

<template>
  <div id="chart" class="component double">
    <div class="value-grid">
      <div class="value">
        <h5>ALT</h5>
        <h3>{{ currentData ? currentData.altitude : "???" }} m</h3>
      </div>
      <div class="value">
        <h5>SPD</h5>
        <h3>{{ currentData ? currentData.speed : "???" }} m/s</h3>
      </div>
      <div class="value">
        <h5>ACC</h5>
        <h3>{{ currentData ? currentData.acceleration : "???" }} m/s²</h3>
      </div>
    </div>
    <Chart></Chart>
  </div>
</template>