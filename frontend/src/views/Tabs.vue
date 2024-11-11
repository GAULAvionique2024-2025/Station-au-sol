<template>
    <div>
      <div class="tabs">
        <button v-for="tab in tabs" :key="tab.name" @click="currentTab = tab.name" :class="{ active: currentTab === tab.name }">
          {{ tab.label }}
        </button>
      </div>
  
      <div class="tab-content">
        <component :is="currentTabComponent"></component>
      </div>
    </div>
  </template>
  
  <script>
  import MapTab from "./MapTab.vue";
  import FlightTab from "./FlightTab.vue";
  import DebugTab from "./DebugTab.vue";
  
  export default {
    data() {
      return {
        currentTab: 'MapTab',
        tabs: [
          { name: 'MapTab', label: 'Map' },
          { name: 'FlightTab', label: 'Flight Mode' },
          { name: 'DebugTab', label: 'Debug Mode' },
        ],
      };
    },
    components: {
      MapTab,
      FlightTab,
      DebugTab,
    },
    computed: {
      currentTabComponent() {
        return this.currentTab;
      },
    },
  };
  </script>
  
<style>
  .tabs button {
    padding: 10px;
    cursor: pointer;
  }
  .tabs button.active {
    font-weight: bold;
    border-bottom: 2px solid #000;
  }
  .tab-content {
    padding: 20px;
  }
  </style>
  