<!-- Component to display the rocket, user and launching pads on a map -->

<script setup>
import MapLeaflet from './ui/MapLeaflet.vue';

import { storeToRefs } from 'pinia';
import { useDataStore } from '@/stores/data';

const { currentData } = storeToRefs(useDataStore());
</script>

<template>
  <div id="map" class="component">
    <h3>
      {{ currentData && currentData.lat ? currentData.lat : "???" }},
      {{ currentData && currentData.lon ? currentData.lon : "???" }}
    </h3>
    <MapLeaflet></MapLeaflet>
  </div>
</template>

<style lang="scss" scoped>
#map {
  display: grid;
  grid-template-rows: max-content 1fr;

  h3 {
    font-size: 1.5rem;
    min-width: max-content;
    margin-bottom: 5px;
    text-align: right;
  }
}
</style>