/**
 * Module to handle interactions with the UI and update the interface/config
 * @module UI
 */

export default class UI {
    constructor({
        'states': states = {},
        'components': components = {},
        'socket': socket = {},
    } = {}) {
        // To access and update the components
        this.components = components;
        // To send data to the server (config, commands, etc.)
        this.socket = socket;

        // App states
        this.states = states;
        // Module states
        this.expanded = false;

        this.initEventListener();
    }

    initEventListener() {
        // Expand button
        document.querySelectorAll('[data-btn="expand"]').forEach((btn) => {
            btn.addEventListener('click', () => this.toggleExpand());
        });

        // Pause button
        document.querySelectorAll('[data-btn="pause"]').forEach((btn) => {
            btn.addEventListener('click', (e) => this.togglePause(e.target));
        });

        // Reset button
        document.querySelectorAll('[data-btn="reset"]').forEach((btn) => {
            btn.addEventListener('click', () => this.reset());
        })

        // Settings button
        document.querySelectorAll('[data-btn="settings"]').forEach((btn) => {
            btn.addEventListener('click', () => this.reset());
        })
    }

    // Expand button
    toggleExpand() {
        if (!this.expanded) {
            // Open
            document.getElementsByTagName("body")[0].classList.add("expanded");
        } else {
            // Close
            document.getElementsByTagName("body")[0].classList.remove("expanded");
        }
        this.expanded = !this.expanded;
    }

    // Pause button
    togglePause(buttonElem) {
        this.states.paused = !this.states.paused;
        if (this.states.paused) {
            buttonElem.classList.remove("btn-danger");
            buttonElem.classList.add("btn-success");
            buttonElem.textContent = "Resume";

            this.components.log("Paused");
        } else {
            buttonElem.classList.remove("btn-success");
            buttonElem.classList.add("btn-danger");
            buttonElem.textContent = "Pause";

            this.components.log("Resumed");
        }
    }

    // Reset button
    reset() {
        this.components.reset_all();
        this.components.log("Reset");
    }
}
