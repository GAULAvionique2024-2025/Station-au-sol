<!-- Component to display the rocket, user and launching pads on a map -->

<script setup>
import MapLeaflet from "./ui/MapLeaflet.vue";

import { storeToRefs } from "pinia";
import { useDataStore } from "@/stores/data";
import { computed } from "vue";

const { currentData } = storeToRefs(useDataStore());

let lastLatitude;
const latitude = computed(() => {
  // if currentData exists and latitude is not null or undefined, display 6 decimals latitude, otherwise display "???"
  if (currentData.value && currentData.value.latitude !== null && currentData.value.latitude !== undefined) {
    let latitude = Number(currentData.value.latitude).toFixed(6); // Keep 6 decimals
    lastLatitude = latitude; // Save last value
    return latitude; // Update UI
  } else if (lastLatitude) {
    // Put text in grey ?
    return lastLatitude; // Use last value
  } else {
    return "???";
  }
});

let lastLongitude;
const longitude = computed(() => {
  // if currentData exists and longitude is not null or undefined, display 6 decimals longitude, otherwise display "???"
  if (currentData.value && currentData.value.longitude !== null && currentData.value.longitude !== undefined) {
    let longitude = Number(currentData.value.longitude).toFixed(6); // Keep 6 decimals
    lastLongitude = longitude; // Save last value
    return longitude; // Update UI
  } else if (lastLongitude) {
    // Put text in grey ?
    return lastLongitude; // Use last value
  } else {
    return "???";
  }
});
</script>

<template>
  <div id="map" class="component">
    <h3>{{ latitude }}, {{ longitude }}</h3>
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
