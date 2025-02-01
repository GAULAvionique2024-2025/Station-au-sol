/*
    Store the settings of the application (mainly in the settings menu).
*/

import { defineStore } from "pinia";
import { getSocket } from "@/utils/socket";
import { ref } from "vue";

const socket = getSocket();

export const useSettingsStore = defineStore("settings", () => {
    // General
    const maxDataToStore = ref(6000); // 12 000 for 20 min with data each 100ms
    const minDataInterval = ref(300); // ms

    // Log to dev console
    const logDataToConsole = ref(false);
    const logEventsToConsole = ref(false);

    // Chart settings
    const chartMaxDataPoints = ref(300);
    const showChart = ref(true); // Hide chart for performance boost

    // Fullscreen setting
    let fullscreen = false;

    function toggleFullscreen() {
        if (!fullscreen) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
        fullscreen = !fullscreen;
    }

    // Go to log file
    function viewLogs() {
        window.open("/logf.txt", "_blank");
    }

    // Pause the data stream
    const paused = ref(false);

    function togglePaused() {
        paused.value = !paused.value;
    }

    // Available paths to connect to the serial port
    const availablePaths = ref([]);
    const currentPath = ref(null);

    function updateAvailablePaths() {
        socket.emit("getAvailablePaths", null, (res) => {
            availablePaths.value = res.availablePaths;
            currentPath.value = res.currentPath;
        });
    }

    // Update settings of the server
    function sendNewSettings(settings) {
        socket.emit("newSettings", settings);
    }

    return {
        maxDataToStore,
        minDataInterval,
        logDataToConsole,
        logEventsToConsole,
        chartMaxDataPoints,
        showChart,
        toggleFullscreen,
        viewLogs,
        paused,
        togglePaused,
        availablePaths,
        currentPath,
        updateAvailablePaths,
        sendNewSettings,
    };
});
