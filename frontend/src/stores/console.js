/*
    Store the text to log in the console component.
*/

import { defineStore } from "pinia";
import { ref } from "vue";
import { getSocket } from "@/utils/socket";
import { useSettingsStore } from "./settings";
import moment from "moment/moment.js";

const socket = getSocket();

export const useConsoleStore = defineStore("console", () => {
    const settings = useSettingsStore();

    // Text to display in the console component
    const consoleText = ref([]);

    // Add a new line to the console component
    function logger(label, html) {
        const time = moment().format("HH:mm:ss");
        consoleText.value.push(`${time} [${label}] ${html}`);
    }

    // Log backend events
    socket.on("log", (log) => {
        if (settings.logEventsToConsole) console.log("Event:", log);

        let { level, label, message } = log;
        label = label || "Global"; // Default label

        let textColor = "";
        switch (level.toLowerCase()) {
            case "error":
                textColor = "text-danger";
                break;
            case "warn":
                textColor = "text-warning";
                break;
            default:
                textColor = "";
        }

        logger(label, `<span class="${textColor}">${level} - ${message}</span>`);
    });

    // Log socket events (Raspberry Pi <-> Web App)
    socket.on("connect", () => {
        logger("Socket", '<span class="text-success">Connected</span> (Raspberry Pi &harr; Web App)');
    });

    socket.on("disconnect", () => {
        logger("Socket", '<span class="text-danger">Disconnected</span> (Raspberry Pi &harr; Web App)');
    });

    return { consoleText, logger };
});
