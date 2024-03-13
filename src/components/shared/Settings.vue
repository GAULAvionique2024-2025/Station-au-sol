<script setup>
import { useSettingsStore } from '@/stores/settings';
import { useUiStore } from '@/stores/ui';

const settings = useSettingsStore();
const ui = useUiStore();
</script>

<template>
  <div class="settings">
    <div class="settings-container">
      <div class="settings-closer" @click="ui.closeSettings"></div>
      <div class="settings-box">
        <div class="settings-header">
          <h3>Settings</h3>
          <button class="btn btn-icon" @click="ui.closeSettings">
            <img src="../../assets/img/close.svg" alt="Close Icon" height="36" width="36" />
          </button>
        </div>
        <div class="settings-content">
          <div class="serial-port">
            <label>Serial port:</label>
            <select id="available-paths">
              <option value="...">...</option>
            </select>
          </div>
          <div class="download-csv">
            <button class="btn btn-secondary" data-btn="download-csv">Download CSV</button>
          </div>
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

    &>div {
      margin: 10px 0;
    }

    .serial-port select {
      margin-left: 10px;
      min-width: 100px;
    }
  }
}
</style>