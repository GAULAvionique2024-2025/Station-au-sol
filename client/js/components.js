/**
 * Module to handles the components (update, reset, log, etc.)
 * @module Components
 */

import Map from "./components/map.js";
import MyChart from "./components/chart.js";
import Status from "./components/status.js";
import Angle from "./components/angle.js";
import Other from "./components/other.js";
import Console from "./components/console.js";

export default class Components {
    constructor({
        'states': states = {},
    } = {}) {
        this.states = states;

        this.options = {
            'maxData': 600,
        };

        this.componentsObj = {
            'map': new Map(),
            'chart': new MyChart({
                'maxData': this.options.maxData,
            }),
            'status': new Status(),
            'angle': new Angle(),
            'other': new Other(),
            'console': new Console(),
        };
    }

    setOptions_all(options) {
        this.options = Object.assign(this.options, options);

        for (const component of Object.values(this.componentsObj)) {
            component.setOptions(this.options);
        }
    }

    update_all(data) {
        if (!this.states.paused) {
            for (const component of Object.values(this.componentsObj)) {
                component.update(data);
            }
        }
    }

    reset_all() {
        for (const component of Object.values(this.componentsObj)) {
            component.reset();
        }
    }

    log(message) {
        this.componentsObj.console.log(message);
    }

    success(message) {
        this.componentsObj.console.success(message);
    }

    error(message) {
        this.componentsObj.console.error(message);
    }
}