/**
 * Main application
 * Initializes all modules
 */

import Components from "./components.js";
import Socket from "./socket.js";
import UI from "./ui.js";

class App {
    constructor() {
        this.states = {
            'paused': false,
        };

        // Starting configuration (store/load from loacalStorage?)
        this.config = {
            'components': {
                'chart': {
                    'maxData': 300,
                },
            },

            'socket': {
                'logSerialDataToConsole': false,
                'logSerialEventsToConsole': false,
            },

            'ui': {

            },
        }

        this.components = new Components({
            'states': this.states,
            'config': this.config.components,
        });

        this.socket = new Socket({
            'states': this.states,
            'config': this.config.socket,
            'components': this.components,
            // 'storage': this.storage, // Not used yet (to store data in localStorage)
        });

        this.ui = new UI({
            'states': this.states,
            // 'config': this.config.ui, // Not used yet
            'components': this.components,
            // 'storage': this.storage, // Not used yet (to store config in localStorage)
            'socket': this.socket,
        });
    }
}

const app = new App();