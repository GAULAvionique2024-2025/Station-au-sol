/*
    Store the data received from the server and the text to log in the console component.
    dataList: Store all data from the server.
    consoleText: Text to display in the console component.
*/

import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { getSocket } from '@/utils/socket';
import { useSettingsStore } from "./settings";
import moment from 'moment/moment.js';

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
        if (settings.logDataToConsole) console.log("Data from server:", data);
        if (!settings.paused) handleData(data, (data) => dataList.value.push(data));
    });

    // Text to display in the console component
    const consoleText = ref([]);

    function logger(html) {
        const time = moment().format("HH:mm:ss")
        consoleText.value.push(`[${time}] ${html}`);
    }

    // Log serial events from the server (Antenna <-> Raspberry Pi)
    socket.on("serialEvent", (event) => {
        if (settings.logSerialEventsToConsole) console.log("Serial Event:", event);

        if (event.type == "opened") {
            logger('<span class="text-blue">Serial</span> <span class="text-success">Connected</span> (Antenna &harr; Raspberry Pi)');
        } else if (event.type == "closed") {
            logger('<span class="text-blue">Serial</span> <span class="text-danger">Disconnected (Closed)</span> (Antenna &harr; Raspberry Pi)');
        } else if (event.type == "error") {
            let msg = "";
            if (event.error.includes("Access denied")) msg = "Access denied";
            else if (event.error.includes("File not found")) msg = "Path not found";
            else msg = event.error;
            logger(`<span class="text-blue">Serial</span> <span class="text-danger">Disconnected (${msg})</span> (Antenna &harr; Raspberry Pi)`);
        }
    });

    // Log socket events (Raspberry Pi <-> Web App)
    socket.on('connect', () => {
        logger('<span class="text-blue">Socket</span> <span class="text-success">Connected</span> (Raspberry Pi &harr; Web App)');
    });

    socket.on('disconnect', () => {
        logger('<span class="text-blue">Socket</span> <span class="text-danger">Disconnected</span> (Raspberry Pi &harr; Web App)');
    });

    return { dataList, currentData, clearData, consoleText, logger }
});

// Format data from the server to keep only 1 decimal
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
