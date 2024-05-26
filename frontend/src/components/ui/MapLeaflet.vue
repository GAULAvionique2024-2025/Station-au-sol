<!-- Leaflet Map used by the MyMap component -->

<script setup>
import { ref, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useDataStore } from '@/stores/data';

import "leaflet/dist/leaflet.css";
import { map as Lmap } from 'leaflet';

import { myMarkers, myLaunchpadsLayer, myPolyline, myLocalTiles, myOnlineTiles, myControlLayer } from './MapLeafletConfig';

const props = defineProps({
  startLatLng: {
    type: Array,
    default: [46.8, -71.3]
  },
  startZoom: {
    type: Number,
    default: 12
  },
  maxData: {
    type: Number,
    default: 500
  },
  localTiles: {
    type: Boolean,
    default: true
  },
});

const myTiles = props.localTiles ? myLocalTiles : myOnlineTiles;

let map; // Leaflet map object

const mapDiv = ref(null); // Div element containing the map

// CREATE MAP ================================================================

onMounted(() => {
  createMap(mapDiv.value);
  getUserLocation();
})

// Create leaflet map from div element
function createMap(mapContainer) {
  map = Lmap(mapContainer).setView(props.startLatLng, props.startZoom);
  myLaunchpadsLayer.addTo(map);
  myPolyline.addTo(map);
  myTiles.addTo(map);
  myControlLayer.addTo(map);
}

// Get the user's location and add a marker to the map
function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      myMarkers.userPos.setLatLng([position.coords.latitude, position.coords.longitude]).addTo(map);
      map.setView([position.coords.latitude, position.coords.longitude]);
    });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}


// UPDATE MAP ================================================================

const { currentData } = storeToRefs(useDataStore());

watch(currentData, (newData, _) => {
  if (Object.keys(newData).length !== 0) {
    updateMap(newData);
  } else {
    resetMap();
  }
});

// Move the rocket marker, focus the map on the marker and update the polyline
function updateMap(currentData) {
  // Skip if missing data
  if (!currentData.lat || !currentData.lon) return

  const latlng = [currentData.lat, currentData.lon];
  // Move the rocket marker and make sure the rocket marker is on the map
  myMarkers.rocket.setLatLng(latlng).addTo(map);
  // Focus the map on the rocket marker
  map.setView(latlng);
  // Update the polyline from dataList
  myPolyline.addLatLng(latlng);
}

function resetMap() {
  myMarkers.rocket.setLatLng([0, 0]).remove();
  myPolyline.setLatLngs([]);
}
</script>

<template>
  <div id="leaflet-map" ref="mapDiv"></div>
</template>

<style lang="scss">
#leaflet-map {
  height: 100%;
}

.leaflet-bar a:active {
  background-color: #e4e4e4;
}

.leaflet-toggleLaunchPads-btn {
  border: 0;
  padding: 6px;
  background-color: white;

  &:hover {
    background-color: #f4f4f4;
  }

  &:active {
    background-color: #e4e4e4;
  }
}

.leaflet-top .leaflet-control {
  margin-top: 5px;
}

.leaflet-right .leaflet-control {
  margin-right: 5px;
}

.leaflet-left .leaflet-control {
  margin-left: 5px;
}

.leaflet-control-layers-overlays>label>span {
  display: flex;
  width: 100%;

  span {
    flex-grow: 1;
    display: flex;
    justify-content: center;
  }
}
</style>