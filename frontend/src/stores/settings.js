/*
    Store the settings of the application (mainly in the settings menu).
*/

import { defineStore } from "pinia";
import { getSocket } from '@/utils/socket';
import { ref } from "vue";

const socket = getSocket();

export const useSettingsStore = defineStore('settings', () => {
    // Log to dev console
    const logDataToConsole = ref(false);
    const logSerialEventsToConsole = ref(false);

    // Chart settings
    const chartMaxDataPoints = ref(300);
    const showChart = ref(true); // Hide chart for performance boost

    // Pause the data stream
    const paused = ref(false);

    function togglePaused() {
        paused.value = !paused.value;
    }

    // Available paths to connect to the serial port
    const availablePaths = ref([]);
    const currentPath = ref(null);

    function updateAvailablePaths() {
        socket.emit('getAvailablePaths', null, (res) => {
            availablePaths.value = res.availablePaths;
            currentPath.value = res.currentPath;
        });
    }

    // Update settings of the server
    function sendNewSettings(settings) {
        socket.emit('newSettings', settings);
    }

    return { logDataToConsole, logSerialEventsToConsole, chartMaxDataPoints, showChart, paused, togglePaused, availablePaths, currentPath, updateAvailablePaths, sendNewSettings }
});