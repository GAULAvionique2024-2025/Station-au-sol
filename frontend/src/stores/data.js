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

    const maxAltitude = ref(0);
    const maxSpeed = ref(0);
    const maxAcceleration = ref(0);

    function updateMaxValues(newData) {
        if (newData.altitude > maxAltitude.value) {
        maxAltitude.value = newData.altitude;
        }
        if (newData.speed > maxSpeed.value) {
        maxSpeed.value = newData.speed;
        }
        if (newData.acceleration > maxAcceleration.value) {
        maxAcceleration.value = newData.acceleration;
        }
    }


    // Handle data events from the server
    socket.on("data", (data) => {
        if (Date.now() - lastDataTime < settings.minDataInterval) return;

        if (settings.logDataToConsole) console.log("Data from server:", data);

        if (!settings.paused) {
            // Update data variables
            currentData.value = data;
            dataList.value.push(data);
            // Limit the number of stored data
            updateMaxValues(data);
            if (dataList.value.length > settings.maxDataToStore) dataList.value.shift();
        }

        lastDataTime = Date.now();
    });

    return { dataList, currentData, clearData, maxAcceleration, maxAltitude, maxSpeed, updateMaxValues, };
});
