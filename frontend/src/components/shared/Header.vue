<!-- Header of the page -->

<script setup>
import LogoGaulSvg from "@/assets/img/logo-gaul.svg";
import SettingsSvg from "@/assets/img/settings.svg";
import ExpandSvg from "@/assets/img/expand.svg";

import { computed } from "vue";
import { useDataStore } from "@/stores/data";
import { useConsoleStore } from "@/stores/console";
import { useSettingsStore } from "@/stores/settings";
import { useUiStore } from "@/stores/ui";
import { storeToRefs } from "pinia";

const { currentData } = storeToRefs(useDataStore());
const clearData = useDataStore().clearData;

// Header title
const headerTitle = computed(() => {
  if (currentData.value.flightMode === 0) {
    return "PRE-FLIGHT";
  } else if (currentData.value.flightMode === 1) {
    return "IN-FLIGHT";
  } else if (currentData.value.flightMode === 2) {
    return "POST-FLIGHT";
  } else {
    return "Ground station";
  }
});

// Reset Button
const { logger } = useConsoleStore();

function resetBtnFunc() {
  clearData();
  logger("Reset");
}

// Pause Button
const settings = useSettingsStore();
const pauseClass = computed(() => (settings.paused ? "btn-success" : "btn-danger"));
const pauseBtnText = computed(() => (settings.paused ? "Resume" : "Pause"));

function pauseBtnFunc() {
  settings.togglePaused();
  logger(settings.paused ? "Paused" : "Resumed");
}

// Settings and Expand Button
const ui = useUiStore();

function settingsBtnFunc() {
  settings.updateAvailablePaths();
  ui.openSettings();
}

function expandBtnFunc() {
  ui.toggleExpanded();
}
</script>

<template>
  <header>
    <!-- Main Header -->
    <div id="top-header" class="d-flex justify-content-between">
      <!-- Logo + Title -->
      <div class="d-flex align-items-center">
        <LogoGaulSvg id="logo-gaul" width="100" height="24" />
        <h1 class="text-white" v-text="headerTitle"></h1>
      </div>

      <!-- Options -->
      <nav>
        <div class="d-flex align-items-center h-100">
          <!-- Buttons -->
          <div id="header-options" class="d-md align-items-center h-100">
            <!-- RouterLink -->
            <!-- <a class="btn btn-link" href="./simple.html">Simple</a> -->
            <!-- <button class="btn btn-secondary" @click="calibBtnFunc">
              Calib.
            </button> -->
            <button class="btn btn-secondary" @click="resetBtnFunc">Reset</button>
            <button class="btn" :class="pauseClass" @click="pauseBtnFunc">
              {{ pauseBtnText }}
            </button>
            <button class="btn btn-icon" @click="settingsBtnFunc">
              <SettingsSvg width="36" height="36" />
            </button>
          </div>

          <!-- Small screen btn -->
          <button class="h-md btn btn-icon mx-1" @click="expandBtnFunc">
            <ExpandSvg height="36" width="36" />
          </button>
        </div>
      </nav>
    </div>
  </header>
</template>

<!-- Style in _header.scss -->
