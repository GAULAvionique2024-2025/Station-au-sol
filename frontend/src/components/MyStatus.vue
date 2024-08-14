<!-- Component to display the Battery, GPS, Ingniter and Connection status -->

<script setup>
import Batt from "@/assets/img/status/batt.svg";
import GPS from "@/assets/img/status/gps.svg";
import Ignit from "@/assets/img/status/ignit.svg";
import Conn from "@/assets/img/status/conn.svg";

import { computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { useDataStore } from "@/stores/data";

const props = defineProps({
  // Seconds until connection is considered lost
  maxConnTimout: {
    type: Number,
    default: 5,
  },
});

const { currentData } = storeToRefs(useDataStore());

const battClass = computed(() => (currentData.value ? colorFromStatus(currentData.value.batt_check) : "yellow"));
const gpsClass = computed(() => (currentData.value ? colorFromStatus(currentData.value.statGPS) : "yellow"));
const ignitClass = computed(() => (currentData.value ? colorFromStatus(currentData.value.igniter_check) : "yellow"));

function colorFromStatus(status) {
  if (Number(status) === 1) {
    return "green";
  } else if (Number(status) === 0) {
    return "red";
  } else {
    return "yellow";
  }
}

let timer = -1; // -1 is unknown
let connInterval;

// Reset timer on data
watch(currentData, () => {
  timer = 0;

  clearInterval(connInterval);
  connInterval = setInterval(() => {
    timer += 1;
  }, 1000);
});

const connClass = computed(() => {
  if (timer > props.maxConnTimout) {
    return "red";
  } else if (timer === -1) {
    return "yellow";
  } else {
    return "green";
  }
});
</script>

<template>
  <div id="status" class="component">
    <div id="batt">
      <Batt :class="battClass" />
      <div id="batt-val">
        <p>???mV</p>
        <p>???mV</p>
        <p>???mV</p>
      </div>
    </div>
    <GPS :class="gpsClass" />
    <div id="ignit">
      <Ignit :class="ignitClass" />
      <div id="ignit-val">
        <p>#1 OK</p>
        <p>#2 ???</p>
        <p>#3 ERR</p>
        <p>#3 ERR</p>
      </div>
    </div>
    <Conn :class="connClass" />
  </div>
</template>

<style lang="scss">
#status {
  display: grid;
  height: 100%;
  grid-template-columns: 50% 50%;
  grid-template-rows: 50% 50%;
  place-items: center;

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

#batt,
#ignit {
  width: 100%;
  display: grid;
  grid-template-columns: 50% 50%;
  align-items: center;
  font-size: smaller;

  svg {
    justify-self: self-end;
  }

  p {
    justify-self: self-start;
    margin: 0;
    margin-left: 0.6em;
  }
}
</style>
