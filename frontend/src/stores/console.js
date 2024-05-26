/*
    Store the text to log in the console component.
*/

import { defineStore } from "pinia";
import { ref } from "vue";
import { getSocket } from '@/utils/socket';
import { useSettingsStore } from "./settings";
import moment from 'moment/moment.js';

const socket = getSocket();

export const useConsoleStore = defineStore('console', () => {
    const settings = useSettingsStore();

    // Text to display in the console component
    const consoleText = ref([]);

    // Add a new line to the console
    function logger(html) {
        const time = moment().format("HH:mm:ss")
        consoleText.value.push(`[${time}] ${html}`);
    }

    // Log serial events from the server (Antenna <-> Raspberry Pi)
    socket.on("serialEvent", (event) => {
        if (settings.logSerialEventsToConsole) console.log("Serial Event:", event);

        if (event.type == "opened") {
            logger(`<span class="text-blue">Serial</span> <span class="text-success">Connected</span> (${event.path}) (Antenna &harr; Raspberry Pi)`);
        } else if (event.type == "closed") {
            logger('<span class="text-blue">Serial</span> <span class="text-danger">Disconnected (Closed)</span> (Antenna &harr; Raspberry Pi)');
        } else if (event.type == "error") {
            let msg = "";
            if (event.error.includes("Access denied")) msg = "Access denied";
            else if (event.error.includes("File not found")) msg = "Path not found";
            else msg = event.error;

            logger(`<span class="text-blue">Serial</span> <span class="text-danger">Disconnected (${msg})</span> (Antenna &harr; Raspberry Pi)`);
        } else {
            // To improve
            logger(`<span class="text-blue">Serial</span> ${event} (Antenna &harr; Raspberry Pi)`);
        }
    });

    // Log socket events (Raspberry Pi <-> Web App)
    socket.on('connect', () => {
        logger('<span class="text-blue">Socket</span> <span class="text-success">Connected</span> (Raspberry Pi &harr; Web App)');
    });

    socket.on('disconnect', () => {
        logger('<span class="text-blue">Socket</span> <span class="text-danger">Disconnected</span> (Raspberry Pi &harr; Web App)');
    });

    return { consoleText, logger }
});