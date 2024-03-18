import { defineStore } from "pinia";
import { getSocket } from '@/utils/socket';
import { ref } from "vue";

const socket = getSocket();

export const useSettingsStore = defineStore('settings', () => {
    const logDataToConsole = ref(false);
    const logSerialEventsToConsole = ref(false);

    const chartMaxDataPoints = ref(300);
    const showChart = ref(true); // Hide chart for performance boost

    const paused = ref(false);

    function togglePaused() {
        paused.value = !paused.value;
    }

    const availablePaths = ref([]);
    const currentPath = ref(null);

    function updateAvailablePaths() {
        socket.emit('getAvailablePaths', null, (res) => {
            availablePaths.value = res.availablePaths;
            currentPath.value = res.currentPath;
        });
    }

    function sendNewSettings(settings) {
        socket.emit('newSettings', settings);
    }

    return { logDataToConsole, logSerialEventsToConsole, chartMaxDataPoints, showChart, paused, togglePaused, availablePaths, currentPath, updateAvailablePaths, sendNewSettings }
});