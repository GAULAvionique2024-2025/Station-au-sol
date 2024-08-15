<!-- Component to display the altitude, vertical speed and vertical acceleration of the rocket on a chart -->

<script setup>
import Chart from "./ui/Chart.vue";

import { storeToRefs } from "pinia";
import { useDataStore } from "@/stores/data";
import { useSettingsStore } from "@/stores/settings.js";

const { currentData } = storeToRefs(useDataStore());
const { showChart } = storeToRefs(useSettingsStore());
</script>

<template>
  <div id="chart" class="component double">
    <div class="value-grid">
      <div class="value">
        <h5>ALT</h5>
        <div>
          <h3>
            {{
              currentData && // avoid error from accessing null or undefined
              currentData.altitude !== null && // show "???" if null
              currentData.altitude !== undefined && // show "???" if undefined
              Number(currentData.altitude) < 99999.9 // Max value to print, else show "???"
                ? Number(currentData.altitude).toFixed(1)
                : "???"
            }}
            m
          </h3>
          <h5 style="width: 100% !important">
            {{
              currentData && // avoid error from accessing null or undefined
              currentData.altitude_ft !== null && // show "???" if null
              currentData.altitude_ft !== undefined && // show "???" if undefined
              Number(currentData.altitude_ft) < 999999.9 // Max value to print, else show "???"
                ? Number(currentData.altitude_ft).toFixed(1)
                : "???"
            }}
            ft.
          </h5>
        </div>
      </div>
      <div class="value">
        <h5>SPD</h5>
        <h3>
          {{
            currentData && // avoid error from accessing null or undefined
            currentData.speed !== null && // show "???" if null
            currentData.speed !== undefined && // show "???" if undefined
            Number(currentData.speed) < 99999.9 // Max value to print, else show "???"
              ? Number(currentData.speed).toFixed(1)
              : "???"
          }}
          m/s
        </h3>
      </div>
      <div class="value">
        <h5>ACC</h5>
        <h3>
          {{
            currentData && // avoid error from accessing null or undefined
            currentData.acceleration !== null && // show "???" if null
            currentData.acceleration !== undefined && // show "???" if undefined
            Number(currentData.acceleration) < 99999.9 // Max value to print, else show "???"
              ? Number(currentData.acceleration).toFixed(1)
              : "???"
          }}
          m/s²
        </h3>
      </div>
    </div>
    <Chart v-if="showChart"></Chart>
  </div>
</template>
