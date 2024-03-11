<script setup>
import { storeToRefs } from 'pinia';
import { useDataStore } from '@/stores/data';
import Chart from './ui/Chart.vue';

const { currentData } = storeToRefs(useDataStore());
</script>

<template>
  <div id="chart" class="component double">
    <div class="value-grid">
      <div class="value">
        <h5>ALT</h5>
        <h3>{{ currentData ? currentData.altitude : 0 }} m</h3>
      </div>
      <div class="value">
        <h5>SPD</h5>
        <h3>{{ currentData ? currentData.speed : 0 }} m/s</h3>
      </div>
      <div class="value">
        <h5>ACC</h5>
        <h3>{{ currentData ? currentData.acceleration : 0 }} m/s²</h3>
      </div>
    </div>
    <Chart></Chart>
  </div>
</template>

<style lang="scss" scoped></style>