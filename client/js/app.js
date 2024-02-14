/**
 * Main application
 * Initializes all the modules
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
                    'maxData': 600,
                },
            },

            'socket': {
                'logDataToConsole': false,
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
        });

        this.ui = new UI({
            'states': this.states,
            'config': this.config.ui,
            'components': this.components,
            'socket': this.socket,
        });
    }

    test() {
        this.components.updateConfig({
            'chart': {
                'test': 123,
            },
            'other': {
                'test': 345,
            },
        });
        console.log(this.components.config);

        this.socket.updateConfig({
            'logDataToConsole': false,
        });
        console.log(this.socket.config);
    }
}

const app = new App();
// app.test();