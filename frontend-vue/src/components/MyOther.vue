<script setup>
import { storeToRefs } from 'pinia';
import { useDataStore } from '@/stores/data';

const { currentData } = storeToRefs(useDataStore());
</script>

<template>
  <div id="other" class="component">
    <div class="value-grid">
      <div class="value">
        <h5>AMB TEMP</h5>
        <h3>{{ currentData && currentData.temperature ? currentData.temperature : "???" }}°C</h3>
      </div>
      <div class="value">
        <h5>ENG TEMP</h5>
        <h3>{{ currentData && currentData.temperature ? currentData.temperature : "???" }}°C</h3>
      </div>
      <div class="value">
        <h5>VIBRATIONS</h5>
        <h3>{{ currentData && currentData.vibrations ? currentData.vibrations : "???" }} Hz</h3>
      </div>
      <div class="value">
        <h5>LAND. FORCE</h5>
        <h3>{{ currentData && currentData.landing_force ? currentData.landing_force : "???" }} N</h3>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#other {
  .value-grid {
    height: 100%;
    max-height: 200px;
  }

  h5 {
    width: 140px;
  }
}
</style>