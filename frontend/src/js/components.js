/**
 * Module to handles the components (map, chart, status, etc.) (update, reset, log, etc.)
 * @module Components
 */

import Map from "./components/map.js";
import MyChart from "./components/chart.js";
import Status from "./components/status.js";
import Angle from "./components/angle.js";
import Other from "./components/other.js";
import Console from "./components/console.js";
import { nestedObjectAssign } from "./utils.js";

export default class Components {
    constructor({
        'states': states = {},
        'config': config = {},
    } = {}) {
        // Application states
        this.states = states
        // Starting module config from app.js
        this.config = nestedObjectAssign({
            'map': {},
            'chart': {},
            'status': {},
            'angle': {},
            'other': {},
            'console': {},
        }, config);

        this.componentsObj = {
            'map': new Map(this.config.map),
            'chart': new MyChart(this.config.chart),
            'status': new Status(this.config.status),
            'angle': new Angle(this.config.angle),
            'other': new Other(this.config.other),
            'console': new Console(this.config.console),
        };
    }

    updateAll(data) {
        if (!this.states.paused) {
            for (const component of Object.values(this.componentsObj)) {
                component.update(data);
            }
        }
    }

    resetAll() {
        for (const component of Object.values(this.componentsObj)) {
            component.reset();
        }
    }

    updateConfig(newConfig) {
        // Nested object merge
        this.config = nestedObjectAssign(this.config, newConfig);
        // Update components
        for (const component of Object.values(this.componentsObj)) {
            component.setConfig(this.config);
        }
    }

    // Methods to log to the console component
    logHTML(message) {
        this.componentsObj.console.logHTML(message);
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