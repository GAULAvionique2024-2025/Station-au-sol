/*
    Store the data received from the server.
*/

import { defineStore } from "pinia";
import { ref } from "vue";
import { getSocket } from "@/utils/socket";
import { useSettingsStore } from "./settings";

const socket = getSocket();

export const useDataStore = defineStore("data", () => {
    const settings = useSettingsStore();

    // Store all data from the server
    const dataList = ref([]);
    // Store the current data used to update the interface
    const currentData = ref({});

    // Empty the data list
    function clearData() {
        dataList.value = [];
        currentData.value = {};
    }

    let lastDataTime = Date.now();

    // Handle data events from the server
    socket.on("data", (data) => {
        if (Date.now() - lastDataTime < settings.minDataInterval) return;

        if (settings.logDataToConsole) console.log("Data from server:", data);

        if (!settings.paused) {
            // Update data variables
            currentData.value = data;
            dataList.value.push(data);
            // Limit the number of stored data
            if (dataList.value.length > settings.maxDataToStore) dataList.value.shift();
        }

        lastDataTime = Date.now();
    });

    return { dataList, currentData, clearData };
});
