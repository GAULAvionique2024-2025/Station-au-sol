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
// Style in _settings.scss

// #settings-fullscreen {
//   display: flex;
//   justify-content: center;
// }

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
</style>
