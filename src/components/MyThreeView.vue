<script setup>
import { storeToRefs } from 'pinia';
import { useDataStore } from '@/stores/data';
import Three from './ui/Three.vue';

const { currentData } = storeToRefs(useDataStore());
</script>

<template>
  <div id="angle" class="component double">
    <div class="value-grid">
      <div class="value">
        <h5>YAW</h5>
        <h3>{{ currentData ? currentData.yaw : 0 }}°</h3>
      </div>
      <div class="value">
        <h5>PITCH</h5>
        <h3>{{ currentData ? currentData.pitch : 0 }}°</h3>
      </div>
      <div class="value">
        <h5>ROLL</h5>
        <h3>{{ currentData ? currentData.roll : 0 }}°</h3>
      </div>
    </div>
    <Three></Three>
  </div>
</template>