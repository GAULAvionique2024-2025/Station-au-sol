<!-- Leaflet Map used by the MyMap component -->

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useDataStore } from '@/stores/data';

import "leaflet/dist/leaflet.css";
import { map as Lmap } from 'leaflet';

import { myMarkers, myLaunchpadsLayer, myPolyline, myLocalTiles, myOnlineTiles } from './MapLeafletConfig';
import { toggleLaunchPadsControl } from './MapLeafletCustomControl';

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
const { dataList } = useDataStore();

onMounted(() => {
  createMap(mapDiv.value);
  getUserLocation();
})

watch(dataList, async (newDataList, _) => {
  if (newDataList.length === 0) {
    resetMap();
  } else {
    updateMap(newDataList);
  }
});


const showLaunchPads = ref(true);

// Add or remove launch pads if "showLaunchPads" is updated
watch(showLaunchPads, async (newShowLaunchPads, _) => {
  if (!map) return;
  if (newShowLaunchPads) {
    myLaunchpadsLayer.addTo(map);
  } else {
    myLaunchpadsLayer.remove();
  }
})

function toggleLaunchPads() {
  showLaunchPads.value = !showLaunchPads.value;
}

const myToggleLaunchPadsControl = toggleLaunchPadsControl({ position: 'topright', toggleLaunchPads: toggleLaunchPads });


// Create leaflet map from div element
function createMap(mapContainer) {
  map = Lmap(mapContainer).setView(props.startLatLng, props.startZoom);
  if (showLaunchPads) myLaunchpadsLayer.addTo(map);
  myPolyline.addTo(map);
  myTiles.addTo(map);
  myToggleLaunchPadsControl.addTo(map);
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

// Move the rocket marker, focus the map on the marker and update the polyline
function updateMap(dataList) {
  const data = dataList.slice(-1)[0];
  // Move the rocket marker and make sure the rocket marker is on the map
  myMarkers.rocket.setLatLng([data.lat, data.lon]).addTo(map);
  // Focus the map on the rocket marker
  map.setView([data.lat, data.lon]);
  // Update the polyline from dataList
  myPolyline.setLatLngs(dataList.slice(-props.maxData).map((data) => [data.lat, data.lon]));
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
</style>