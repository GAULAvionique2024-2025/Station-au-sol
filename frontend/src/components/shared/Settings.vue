<!-- Settings menu when the settings button of the header is clicked -->

<script setup>
import CloseSVG from '@/assets/img/close.svg';

import { useSettingsStore } from '@/stores/settings';
import { useUiStore } from '@/stores/ui';

const settings = useSettingsStore();
const { closeSettings } = useUiStore();

function sendNewSettings(e) {
  settings.sendNewSettings({ 'path': e.target.value });
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
          <div id="settings-log-data">
            <label>Log data to dev console</label>
            <input type="checkbox" v-model="settings.logDataToConsole" />
          </div>
          <div id="settings-serial-port">
            <label>Serial port:</label>
            <select id="available-paths" @change="sendNewSettings">
              <option v-for="path in settings.availablePaths" :value="path" :key="path"
                :selected="path === settings.currentPath">
                {{ path }}
              </option>
            </select>
          </div>
          <!-- <div class="download-csv">
            <button class="btn btn-secondary" data-btn="download-csv">Download CSV</button>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/variables' as *;

$settings-zindex: 2000;

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
    width: 80%;
    height: 70%;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
    padding: 20px;
    z-index: calc($settings-zindex + 1);
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
    display: grid;
    grid-template-columns: 1fr 1fr;

    @media screen and (max-width: $layout-breakpoint-sm) {
      grid-template-columns: 1fr;
    }

    &>div {
      min-height: 50px;
      display: flex;
      align-items: center;
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 6px 8px;
      margin: 4px 4px;
    }
  }
}

#settings-log-data input {
  margin-left: 10px;
  width: 20px;
  height: 20px;
}

#settings-serial-port select {
  margin-left: 10px;
  min-width: 100px;
}
</style>