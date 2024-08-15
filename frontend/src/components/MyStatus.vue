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

const battClass = computed(() => {
  if (
    currentData.value &&
    currentData.value.batt1_mV !== null &&
    currentData.value.batt1_mV !== undefined &&
    currentData.value.batt2_mV !== null &&
    currentData.value.batt2_mV !== undefined &&
    currentData.value.batt3_mV !== null &&
    currentData.value.batt3_mV !== undefined
  ) {
    if (currentData.value.batt1_mV > 1000 && currentData.value.batt2_mV > 1000 && currentData.value.batt3_mV > 1000) {
      // Enough voltage
      return "green";
    } else {
      // Low voltage
      return "red";
    }
  } else {
    // Unknown voltage
    return "yellow";
  }
});

const gpsClass = computed(() => {
  if (currentData.value && currentData.value.gps_fix === 1) {
    return "green";
  } else if (currentData.value && currentData.value.gps_fix === 0) {
    return "red";
  } else {
    return "yellow";
  }
});

const ignitClass = computed(() => {
  if (
    // No data or all igniter are unknown
    !currentData.value ||
    (nullOrUndefined(currentData.value.statIgniter1) &&
      nullOrUndefined(currentData.value.statIgniter2) &&
      nullOrUndefined(currentData.value.statIgniter3) &&
      nullOrUndefined(currentData.value.statIgniter4))
  ) {
    return "yellow";
  }

  if (
    // At least one igniter is in error
    currentData.value.statIgniter1 === 0 ||
    currentData.value.statIgniter2 === 0 ||
    currentData.value.statIgniter3 === 0 ||
    currentData.value.statIgniter4 === 0
  ) {
    return "red";
  } else {
    return "green";
  }
});

function nullOrUndefined(value) {
  return value === null || value === undefined;
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
        <p>
          {{
            currentData && currentData.batt1_mV !== null && currentData.batt1_mV !== undefined
              ? Number(currentData.batt1_mV).toFixed(0)
              : "???"
          }}mV
        </p>
        <p>
          {{
            currentData && currentData.batt2_mV !== null && currentData.batt2_mV !== undefined
              ? Number(currentData.batt2_mV).toFixed(0)
              : "???"
          }}mV
        </p>
        <p>
          {{
            currentData && currentData.batt3_mV !== null && currentData.batt3_mV !== undefined
              ? Number(currentData.batt3_mV).toFixed(0)
              : "???"
          }}mV
        </p>
      </div>
    </div>
    <GPS :class="gpsClass" />
    <div id="ignit">
      <Ignit :class="ignitClass" />
      <div id="ignit-val">
        <p>
          #1
          <span :class="{ red: currentData && currentData.statIgniter1 === 0 }">
            {{
              currentData && currentData.statIgniter1 !== null && currentData.statIgniter1 !== undefined
                ? currentData.statIgniter1 === 1
                  ? "OK"
                  : "ERR"
                : "???"
            }}
          </span>
        </p>
        <p>
          #2
          <span :class="{ red: currentData && currentData.statIgniter2 === 0 }">
            {{
              currentData && currentData.statIgniter2 !== null && currentData.statIgniter2 !== undefined
                ? currentData.statIgniter2 === 1
                  ? "OK"
                  : "ERR"
                : "???"
            }}
          </span>
        </p>
        <p>
          #3
          <span :class="{ red: currentData && currentData.statIgniter3 === 0 }">
            {{
              currentData && currentData.statIgniter3 !== null && currentData.statIgniter3 !== undefined
                ? currentData.statIgniter3 === 1
                  ? "OK"
                  : "ERR"
                : "???"
            }}
          </span>
        </p>
        <p>
          #4
          <span :class="{ red: currentData && currentData.statIgniter4 === 0 }">
            {{
              currentData && currentData.statIgniter4 !== null && currentData.statIgniter4 !== undefined
                ? currentData.statIgniter4 === 1
                  ? "OK"
                  : "ERR"
                : "???"
            }}
          </span>
        </p>
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
  font-size: 14px;

  svg {
    justify-self: self-end;
  }

  p {
    justify-self: self-start;
    margin: 0;
    margin-left: 0.6em;
    font-weight: bold;
  }
}

p > span.red {
  color: red;
}
</style>
