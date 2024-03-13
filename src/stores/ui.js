import { defineStore } from "pinia";
import { ref } from "vue";

export const useUiStore = defineStore('ui', () => {
    const showSettings = ref(false);

    function openSettings() {
        showSettings.value = true;
    }

    function closeSettings() {
        showSettings.value = false;
    }

    const expanded = ref(false);

    function toggleExpanded() {
        expanded.value = !expanded.value;
    }

    return { showSettings, openSettings, closeSettings, expanded, toggleExpanded }
});