<script setup>
import Batt from '@/assets/img/status/batt.svg';
import GPS from '@/assets/img/status/gps.svg';
import Ignit from '@/assets/img/status/ignit.svg';
import Conn from '@/assets/img/status/conn.svg';

import { ref, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useDataStore } from '@/stores/data';

const props = defineProps({
  maxConnTimout: {
    type: Number,
    default: 10,
  },
});

const valueBind = {
  '0': 'red',
  '1': 'green',
};

const { currentData } = storeToRefs(useDataStore());

const battClass = computed(() => currentData.value == undefined ? 'yellow' : valueBind[currentData.value.batt_check]);
const gpsClass = computed(() => currentData.value == undefined ? 'yellow' : valueBind[currentData.value.gps_check]);
const ignitClass = computed(() => currentData.value == undefined ? 'yellow' : valueBind[currentData.value.igniter_check]);

// Connection status (Will probably be moved to backend, and will send "1" if the connection is good)
let timer = ref(0);
let connInterval;

// Reset timer on data
watch(currentData, () => {
  timer.value = 0;

  clearInterval(connInterval);
  connInterval = setInterval(() => { timer.value += 1 }, 1000);
});

const connClass = computed(() => {
  if (timer.value > props.maxConnTimout) {
    return 'red';
  } else if (timer.value > props.maxConnTimout / 2) {
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