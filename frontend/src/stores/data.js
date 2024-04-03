/*
    Store the data received from the server.
*/

import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { getSocket } from '@/utils/socket';
import { useSettingsStore } from "./settings";

const socket = getSocket();

export const useDataStore = defineStore('data', () => {
    const settings = useSettingsStore();

    // Store all data from the server TO DO: ADD A LIMIT
    const dataList = ref([]);
    // Store the current data used to update the interface
    const currentData = computed(() => dataList.value.slice(-1)[0]);

    // Empty the data list
    function clearData() {
        dataList.value.splice(0);
    }

    socket.on('data', (data) => {
        if (settings.logDataToConsole) console.log("Data from server:", data);
        if (!settings.paused) handleData(data, (data) => dataList.value.push(data));
    });

    return { dataList, currentData, clearData }
});

// Format data from the server to keep only 1 decimal
function handleData(data, callback) {
    // Keep 1 decimal
    data.altitude = data.altitude ? Number(data.altitude).toFixed(1) : null;
    data.altitude_ft = data.altitude ? Number(data.altitude * 3.28084).toFixed(1) : null;
    data.speed = data.speed ? Number(data.speed).toFixed(1) : null;
    data.acceleration = data.acceleration ? Number(data.acceleration).toFixed(1) : null;
    data.pitch = data.pitch ? Number(data.pitch).toFixed(1) : null;
    data.yaw = data.yaw ? Number(data.yaw).toFixed(1) : null;
    data.roll = data.roll ? Number(data.roll).toFixed(1) : null;
    callback(data);
}
