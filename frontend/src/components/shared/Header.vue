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
            <button class="btn btn-secondary"><RouterLink to="/">Pages</RouterLink></button>
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

<style lang="scss" scoped>
@use "@/assets/scss/variables" as *;

header {
  min-width: $min-width;
  background-color: $header-bg;

  #top-header {
    height: $header-height;
  }

  a{
    color: white;
    text-decoration: none;
  }

  // Title
  h1 {
    margin: 0.25rem 0 0.4rem 0;
    font-family: OpenSans-SemiBold;
    font-size: calc($header-height * 0.6);
    letter-spacing: -1px;

    @media screen and (max-width: calc($header-breakpoint-sm - 0.2px)) {
      font-size: large !important;
    }
  }

  // Ajust img size based on header height
  img {
    height: calc($header-height * 0.6);
    width: calc($header-height * 0.6);
  }

  // Ajust button size based on header height
  .btn {
    padding: calc($header-height / 6) calc($header-height / 4);
  }

  .btn-icon {
    padding: calc($header-height / 10) calc($header-height / 4);
  }

  #header-options button {
    margin-left: 0.25rem !important;
    margin-right: 0.25rem !important;
  }

  // Show logo on screen bigger than sm breakpoint
  .d-sm {
    display: none;

    @media screen and (min-width: $header-breakpoint-sm) {
      display: block;
    }
  }

  // Show logo and title on screen bigger than md breakpoint
  .d-md {
    display: none;

    @media screen and (min-width: $header-breakpoint-md) {
      display: flex;
    }
  }

  // Hide expand icon on screen bigger than md breakpoint
  .h-md {
    display: block;

    @media screen and (min-width: $header-breakpoint-md) {
      display: none;
    }
  }
}

#logo-gaul {
  height: calc($header-height / 2);
  width: calc($header-height * 100 / 48);
  margin: 0 calc($header-height / 6);
}

#expand-ico {
  transition: transform 0.3s;
}

// Close the header when screen bigger than md breakpoint (all elements)
@media screen and (max-width: calc($header-breakpoint-md - 0.2px)) {
  // Expand the header when body elem has class expanded
  .expanded {
    header {
      height: $header-height * 2;
    }

    .grid {
      height: calc(100vh - $header-height * 2);
    }

    #header-options {
      display: flex !important;
      height: $header-height !important;
      position: absolute;
      top: $header-height;
      right: 0;
    }

    #expand-ico {
      transform: rotate(0.5turn);
    }
  }
}

// Fix the header when screen smaller than min-width * 0.85 (galaxy fold)
@media screen and (max-width: calc($min-width * 0.85 - 0.2px)) {
  #header-options {
    transform: scale(0.8) translate(30%);
  }
}
</style>
