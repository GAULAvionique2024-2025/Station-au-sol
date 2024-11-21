<!-- Settings menu when the settings button of the header is clicked -->

<script setup>
import CloseSVG from "@/assets/img/close.svg";
import FullscreenSVG from "@/assets/img/fullscreen.svg";

import { useSettingsStore } from "@/stores/settings";
import { useUiStore } from "@/stores/ui";

const settings = useSettingsStore();
const { closeSettings } = useUiStore();

function sendNewSettings(e) {
  settings.sendNewSettings({ path: e.target.value });
}
</script>

<template>
  <div class="settings">
    <div class="settings-container">
      <div class="settings-closer" @click="closeSettings"></div>
      <div class="settings-box">
        <div class="settings-header">
          <h3>Settings</h3>
          <button class="btn btn-icon" @click="closeSettings">
            <CloseSVG />
          </button>
        </div>
        <div class="settings-content">
          <details open id="settings-buttons">
            <summary>Buttons</summary>
            <div class="details-content">
              <!-- Setting elem -->
              <div>
                <button class="btn btn-secondary" @click="settings.toggleFullscreen">
                  <span style="padding-right: 8px">Toggle</span>
                  <FullscreenSVG />
                </button>
                <button class="btn btn-secondary" @click="settings.viewLogs">View Logs</button>
              </div>
            </div>
          </details>
          <!-- Section -->
          <details open id="settings-general">
            <summary>General</summary>
            <div class="details-content">
              <!-- Setting elem -->
              <div id="settings-serial-port">
                <label>Serial port:</label>
                <select id="available-paths" @change="sendNewSettings">
                  <option
                    v-for="path in settings.availablePaths"
                    :value="path"
                    :key="path"
                    :selected="path === settings.currentPath"
                  >
                    {{ path }}
                  </option>
                </select>
              </div>
              <!-- Setting elem -->
              <div id="settings-min-data-interval" class="slider-settings">
                <label>Min data interval</label>
                <input type="range" min="0" max="1500" step="50" v-model="settings.minDataInterval" />
                <span>{{ settings.minDataInterval }} ms</span>
              </div>
              <!-- Setting elem -->
              <div id="settings-log-data">
                <label>Log data to dev console</label>
                <input type="checkbox" v-model="settings.logDataToConsole" />
              </div>
            </div>
          </details>
          <details open id="settings-chart">
            <summary>Chart</summary>
            <div class="details-content">
              <!-- Setting elem -->
              <div id="settings-show-chart">
                <label>Render chart</label>
                <input type="checkbox" v-model="settings.showChart" />
              </div>
              <!-- Setting elem -->
              <div id="settings-chartjs-max-data" class="slider-settings">
                <label>Max Chart data</label>
                <input type="range" min="100" max="1500" step="50" v-model="settings.chartMaxDataPoints" />
                <span>{{ settings.chartMaxDataPoints }}</span>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/scss/variables" as *;

$settings-zindex: 2000;

#settings-serial-port select {
  min-width: 100px;
}

#settings-min-data-interval {
  display: flex;
  flex-wrap: wrap;

  input {
    width: 120px;
  }

  span {
    margin-left: 10px;
    min-width: max-content;
  }
}

.settings {
  display: none;
}

.settings-opened {
  overflow: hidden;

  .settings {
    display: block;
  }
}

.settings {
  position: fixed;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: $settings-zindex;

  .settings-container {
    display: grid;
    width: 100%;
    height: 100%;
    place-items: center;
  }

  .settings-closer {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
  }

  .settings-box {
    display: grid;
    grid-template-rows: min-content auto;
    width: 80%;
    height: 70%;
    padding: 20px;
    border-radius: 10px;
    background-color: white;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
    z-index: calc($settings-zindex + 1);

    @media screen and (max-width: calc($layout-breakpoint-sm - 100px)) {
      width: 95%;
    }
  }

  .settings-header {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;

    h3 {
      margin-left: 10px;
    }
  }

  .settings-content {
    padding: 10px;
    overflow-y: scroll;

    // Section style
    summary {
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      margin: 4px 4px;
      background-color: #f8f8f8;
    }

    // Settings elements on two columns
    .details-content {
      display: grid;
      grid-template-columns: 50% 50%;

      @media screen and (max-width: $layout-breakpoint-sm) {
        grid-template-columns: 100%;
      }
    }

    // Buttons on the same column
    #settings-buttons .details-content > div {
      grid-column-start: span 2;
      justify-content: space-around;
      button {
        min-width: 120px;
      }
    }

    // Setting elements
    & > div,
    .details-content > div {
      min-height: 50px;
      display: flex;
      align-items: center;
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 6px 8px;
      margin: 4px 4px;

      & > input,
      select {
        margin-left: 10px;
      }

      & input[type="checkbox"] {
        width: 20px;
        height: 20px;
      }
    }
  }
}
</style>
