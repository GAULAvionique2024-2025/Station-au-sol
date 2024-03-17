import { defineStore } from "pinia";
import { ref } from "vue";

export const useSettingsStore = defineStore('settings', () => {
    const logDataToConsole = ref(false);
    const logSerialEventsToConsole = ref(false);

    const chartMaxDataPoints = ref(300);
    const showChart = ref(true); // Hide chart for performance boost

    const paused = ref(false);

    function togglePaused() {
        paused.value = !paused.value;
    }

    return { logDataToConsole, logSerialEventsToConsole, chartMaxDataPoints, showChart, paused, togglePaused }
});