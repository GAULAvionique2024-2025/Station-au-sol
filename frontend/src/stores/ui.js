/*
    Store the UI state of the application.
    - State of the settings menu (open or closed).
    - State of the navbar (expanded or collapsed).
*/

import { defineStore } from "pinia";
import { ref } from "vue";

export const useUiStore = defineStore('ui', () => {
    // State of the settings menu
    const showSettings = ref(false);

    function openSettings() {
        showSettings.value = true;
    }

    function closeSettings() {
        showSettings.value = false;
    }

    // State of the navbar
    const expanded = ref(false);

    function toggleExpanded() {
        expanded.value = !expanded.value;
    }

    return { showSettings, openSettings, closeSettings, expanded, toggleExpanded }
});