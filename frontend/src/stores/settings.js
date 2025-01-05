import { defineStore } from "pinia";
import { ref } from "vue";
import { getSocket } from "@/utils/socket";

const socket = getSocket();

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    showAltitude: true, // Toggle altitude display
    showSpeed: true, // Toggle speed display
    showAcceleration: true, // Toggle acceleration display
    showChart: true, // Toggle entire chart display
    maxDataToStore: 6000, // Max number of data points to store
    chartMaxDataPoints: 300, // Max data points to display in the chart
    paused: false, // Pause/resume data stream
    availablePaths: [], // Serial port paths
    currentPath: null, // Selected path
  }),

  actions: {
    togglePaused() {
      this.paused = !this.paused;
    },

    updateAvailablePaths() {
      socket.emit("getAvailablePaths", null, (res) => {
        this.availablePaths = res.availablePaths;
        this.currentPath = res.currentPath;
      });
    },

    sendNewSettings(settings) {
      socket.emit("newSettings", settings);
    },
  },
});
