import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { getSocket } from '@/socket';
import { useSettingsStore } from "./settings";

const socket = getSocket();

export const useDataStore = defineStore('data', () => {
    const settings = useSettingsStore();

    // Store all data from the server
    const dataList = ref([]);
    // Store the current data used to update the interface
    const currentData = computed(() => dataList.value.slice(-1)[0]);

    function clearData() {
        dataList.value.splice(0);
    }

    socket.on('data', (data) => {
        if (settings.logDataToConsole) console.log('Data from server:', data);
        if (!settings.paused) handleData(data, (data) => dataList.value.push(data));
    });

    return { dataList, currentData, clearData }
});

function handleData(data, callback) {
    // Keep 1 decimal
    data.altitude = Number(data.altitude).toFixed(1);
    data.speed = Number(data.speed).toFixed(1);
    data.acceleration = Number(data.acceleration).toFixed(1);
    data.pitch = Number(data.pitch).toFixed(1);
    data.yaw = Number(data.yaw).toFixed(1);
    data.roll = Number(data.roll).toFixed(1);
    callback(data);
}
