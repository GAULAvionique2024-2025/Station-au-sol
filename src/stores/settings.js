import { defineStore } from "pinia";
import { ref } from "vue";

export const useSettingsStore = defineStore('settings', () => {
    const logDataToConsole = ref(false);

    return { logDataToConsole }
});