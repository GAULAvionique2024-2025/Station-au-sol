<script setup>
import { computed } from 'vue';
import { useDataStore } from '@/stores/data';
import { useSettingsStore } from '@/stores/settings';
import { useUiStore } from '@/stores/ui';

const { clearData } = useDataStore();

const settings = useSettingsStore();
const pauseClass = computed(() => settings.paused ? 'btn-success' : 'btn-danger');

const ui = useUiStore();
</script>

<template>
  <header>
    <!-- Main Header -->
    <div id="top-header" class="d-flex justify-content-between">
      <!-- Logo + Title -->
      <div class="d-flex align-items-center">
        <img id="logo-gaul" src="../../assets/img/logo-gaul.svg" alt="Logo GAUL" width="100" height="24" />
        <h1 class="text-white d-sm">Ground station</h1>
      </div>

      <!-- Options -->
      <nav>
        <div class="d-flex align-items-center h-100">
          <!-- Buttons -->
          <div id="header-options" class="d-md align-items-center h-100">
            <a class="btn btn-link" href="./simple.html">Simple</a> <!-- RouterLink -->
            <button class="btn btn-secondary" @click="clearData">
              Reset
            </button>
            <button class="btn" :class="pauseClass" @click="settings.togglePaused">
              {{ settings.paused ? 'Resume' : 'Pause' }}
            </button>
            <button class="btn btn-icon" @click="ui.openSettings">
              <img src="../../assets/img/settings.svg" alt="Settings Icon" height="36" width="36" />
            </button>
          </div>

          <!-- Small screen btn -->
          <button class="h-md btn btn-icon mx-1" @click="ui.toggleExpanded">
            <img id="expand-ico" src="../../assets/img/expand.svg" alt="Expand Icon" height="36" width="36" />
          </button>
        </div>
      </nav>
    </div>
  </header>
</template>

<!-- Style in _header.scss -->