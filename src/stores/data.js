import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { getSocket } from '@/socket';

const socket = getSocket();

export const useDataStore = defineStore('data', () => {
    // Store all data from the server
    const dataList = ref([]);
    // Store the current data used to update the interface
    const currentData = computed(() => dataList.value.slice(-1)[0]);

    socket.on('data', (data) => {
        handleData(data);
    })

    function handleData(data) {
        // Keep 1 decimal
        data.altitude = Number(data.altitude).toFixed(1);
        data.speed = Number(data.speed).toFixed(1);
        data.acceleration = Number(data.acceleration).toFixed(1);
        data.pitch = Number(data.pitch).toFixed(1);
        data.yaw = Number(data.yaw).toFixed(1);
        data.roll = Number(data.roll).toFixed(1);
        // Add the new data to the list
        dataList.value.push(data);
    }

    return { dataList, currentData }
});