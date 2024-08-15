<!-- Component to display the ambiant temperature, the engine temperature, the vibrations and the landing force of the rocket -->

<script setup>
import { storeToRefs } from "pinia";
import { useDataStore } from "@/stores/data";

const { currentData } = storeToRefs(useDataStore());
</script>

<template>
  <div id="other" class="component">
    <div class="value-grid">
      <div class="value">
        <h5>AMB TEMP</h5>
        <h3>
          {{
            currentData && currentData.temperature !== null && currentData.temperature !== undefined
              ? Number(currentData.temperature).toFixed(1)
              : "???"
          }}°C
        </h3>
      </div>
      <div class="value">
        <h5>ACC STAT</h5>
        <h3>
          {{
            currentData && currentData.statAccelerometer !== null && currentData.statAccelerometer !== undefined
              ? currentData.statAccelerometer === 1
                ? "OK"
                : "ERR"
              : "???"
          }}
        </h3>
      </div>
      <div class="value">
        <h5>BARO STAT</h5>
        <h3>
          {{
            currentData && currentData.statBarometer !== null && currentData.statBarometer !== undefined
              ? currentData.statBarometer === 1
                ? "OK"
                : "ERR"
              : "???"
          }}
        </h3>
      </div>
      <div class="value">
        <h5>SD STAT</h5>
        <h3>
          {{
            currentData && currentData.statSD !== null && currentData.statSD !== undefined
              ? currentData.statSD === 1
                ? "OK"
                : "ERR"
              : "???"
          }}
        </h3>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#other {
  .value-grid {
    height: 100%;
    max-height: 200px;
  }

  h5 {
    width: 140px;
  }
}
</style>
