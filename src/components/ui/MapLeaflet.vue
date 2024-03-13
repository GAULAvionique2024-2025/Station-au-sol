<script setup>
import { ref, onMounted, watch } from 'vue';
import { useDataStore } from '@/stores/data';

import "leaflet/dist/leaflet.css";
import { polyline as Lpolyline, map as Lmap, tileLayer as LtileLayer, icon as Licon, marker as Lmarker } from 'leaflet';


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
  }
});

const icons = {
  rocket: Licon({
    iconUrl: '/img/rocket.svg',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  }),
  userPos: Licon({
    iconUrl: '/img/user_pos.png',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -8],
  }),
};

let map; // Leaflet map object
const markers = {
  rocket: Lmarker([0, 0], { icon: icons.rocket }).bindPopup("<b>Rocket position</b>"),
  userPos: Lmarker([0, 0], { icon: icons.userPos }).bindPopup("<b>You're here</b>"),
};
const polyline = Lpolyline([], { color: 'grey' });

// IL FAUT UNE CONNEXION INTERNET POUR QUE ÇA MARCHE, À REVOIR (Télécharger les tuiles en local)
const tiles = LtileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});


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


// Create leaflet map from div element
function createMap(mapContainer) {
  map = Lmap(mapContainer).setView(props.startLatLng, props.startZoom);
  markers.rocket.addTo(map);
  polyline.addTo(map);
  tiles.addTo(map);
}

// Get the user's location and add a marker to the map
function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      markers.userPos.setLatLng([position.coords.latitude, position.coords.longitude]).addTo(map);
      map.setView([position.coords.latitude, position.coords.longitude]);
    });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

// Move the rocket marker, focus the map on the marker and update the polyline
function updateMap(dataList) {
  const data = dataList.slice(-1)[0];
  // Move the rocket marker
  markers.rocket.setLatLng([data.lat, data.lon]);
  // Focus the map on the rocket marker
  map.setView([data.lat, data.lon]);
  // Update the polyline from dataList
  polyline.setLatLngs(dataList.slice(-props.maxData).map((data) => [data.lat, data.lon]));
}

function resetMap() {
  markers.rocket.setLatLng([0, 0]);
  polyline.setLatLngs([]);
}
</script>

<template>
  <div ref="mapDiv"></div>
</template>

<style scoped>
div {
  height: 100%;
}
</style>