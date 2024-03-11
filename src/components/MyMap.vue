<script setup>
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useDataStore } from '@/stores/data';
import LeafletMap from './ui/LeafletMap.vue';

// Starting coordinates
const coords = ref("00.00000, 00.00000")

// Watch for changes in the data store
const dataStore = storeToRefs(useDataStore());

watch(dataStore.currentData, async (newData, _) => {
  coords.value = `${newData.lat}, ${newData.lon}`;
});
</script>

<template>
  <div id="map" class="component">
    <h3>{{ coords }}</h3>
    <LeafletMap></LeafletMap>
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