<script setup>
import Three from './ui/Three.vue';

import { storeToRefs } from 'pinia';
import { useDataStore } from '@/stores/data';

const { currentData } = storeToRefs(useDataStore());
</script>

<template>
  <div id="angle" class="component double">
    <div class="value-grid">
      <div class="value">
        <h5>YAW</h5>
        <h3>{{ currentData && currentData.yaw ? currentData.yaw : "???" }}°</h3>
      </div>
      <div class="value">
        <h5>PITCH</h5>
        <h3>{{ currentData && currentData.pitch ? currentData.pitch : "???" }}°</h3>
      </div>
      <div class="value">
        <h5>ROLL</h5>
        <h3>{{ currentData && currentData.roll ? currentData.roll : "???" }}°</h3>
      </div>
    </div>
    <Three></Three>
  </div>
</template>