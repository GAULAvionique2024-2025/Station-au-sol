<!-- Component to display the Battery, GPS, Ingniter and Connection status -->

<script setup>
import Batt from '@/assets/img/status/batt.svg';
import GPS from '@/assets/img/status/gps.svg';
import Ignit from '@/assets/img/status/ignit.svg';
import Conn from '@/assets/img/status/conn.svg';

import { computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useDataStore } from '@/stores/data';

const props = defineProps({
  // Seconds until connection is considered lost
  maxConnTimout: {
    type: Number,
    default: 10,
  },
});

const { currentData } = storeToRefs(useDataStore());

const battClass = computed(() => currentData.value ? colorFromStatus(currentData.value.batt_check) : "yellow");
const gpsClass = computed(() => currentData.value ? colorFromStatus(currentData.value.statGPS) : "yellow");
const ignitClass = computed(() => currentData.value ? colorFromStatus(currentData.value.igniter_check) : "yellow");

function colorFromStatus(status) {
  if (Number(status) === 1) {
    return 'green';
  } else if (Number(status) === 0) {
    return 'red';
  } else {
    return 'yellow';
  }
}

// Connection status (Will probably be moved to backend, and will send "1" if the connection is good)
let timer = 0;
let connInterval;

// Reset timer on data
watch(currentData, () => {
  timer = 0;

  clearInterval(connInterval);
  connInterval = setInterval(() => { timer += 1 }, 1000);
});

const connClass = computed(() => {
  if (timer > props.maxConnTimout) {
    return 'red';
  } else if (timer > props.maxConnTimout / 2) {
    return 'yellow';
  } else {
    return 'green';
  }
});
</script>

<template>
  <div id="status" class="component">
    <Batt id="batt" :class="battClass" />
    <GPS id="gps" :class="gpsClass" />
    <Ignit id="ignit" :class="ignitClass" />
    <Conn id="conn" :class="connClass" />
  </div>
</template>

<style lang="scss">
#status {
  display: grid;
  height: 100%;
  grid-template-columns: 50% 50%;
  grid-template-rows: 50% 50%;
  justify-items: center;
  align-items: center;

  .green path {
    fill: #00c116 !important;
  }

  .yellow path {
    fill: #f6f303 !important;
  }

  .red path {
    fill: #e10303 !important;
  }
}
</style>