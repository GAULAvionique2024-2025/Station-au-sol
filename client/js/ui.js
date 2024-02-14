/**
 * Module to handle interactions with the UI and update the interface/config
 * @module UI
 */

export default class UI {
    constructor({
        'states': states = {},
        'config': config = {},
        'components': components = {},
        'socket': socket = {},
    } = {}) {
        // Application states
        this.states = states;
        // Starting module config from app.js
        this.config = Object.assign({}, config);

        // Module states
        this.moduleStates = {
            'expanded': false,
        };

        // To access and update the components
        this.components = components;
        // To send data to the server (config, commands, etc.)
        this.socket = socket;

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
        if (!this.moduleStates.expanded) {
            // Open
            document.getElementsByTagName("body")[0].classList.add("expanded");
        } else {
            // Close
            document.getElementsByTagName("body")[0].classList.remove("expanded");
        }
        this.moduleStates.expanded = !this.moduleStates.expanded;
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
        this.components.resetAll();
        this.components.log("Reset");
    }

    updateConfig(config) {
        this.config = Object.assign(this.config, config);
    }
}
