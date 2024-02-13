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

        this.components = new Components({
            'states': this.states,
        });

        this.socket = new Socket({
            'states': this.states,
            'components': this.components,
        });

        this.ui = new UI({
            'states': this.states,
            'components': this.components,
            'socket': this.socket,
        });
    }

    test() {
        console.log(this.components.options);

        this.components.setOptions_all({
            'test': 0,
        });

        console.log(this.components.options);
    }
}

const app = new App();
// app.test();