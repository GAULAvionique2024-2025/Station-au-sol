/**
 * Module to receive or send data to the server
 * - Handle socket connections
 * - Update components with the data received from the server
 * - Update the server config
 * @module Socket
 */

export default class Socket {
    constructor({
        'states': states = {},
        'config': config = {},
        'components': components = {},
    } = {}) {
        // Application states
        this.states = states;
        // Starting module config from app.js
        this.config = Object.assign({
            'logDataToConsole': true,
            'logSerialEventsToConsole': true,
        }, config);

        // To access and update the components
        this.components = components;

        // Initialize the socket
        this.socket = io();

        this.setupEvents();
    }

    setupEvents() {
        // Serial data
        this.socket.on("data", (data) => {
            this.handleData(data, (data) => {
                this.components.updateAll(data);
            })
        });

        // Serial events
        this.socket.on("serialEvent", (event) => {
            if (this.config.logSerialEventsToConsole) {
                console.log("SerialEvent", event);
            }

            if (event.type == "opened") {
                this.components.logHTML('<span class="text-blue">Serial</span> <span class="text-success">Connected</span> (raspberry pi antenna)');
            } else if (event.type == "closed" || event.type == "error") {
                this.components.logHTML('<span class="text-blue">Serial</span> <span class="text-danger">Disconnected</span> (raspberry pi antenna)');
            }
        });

        // Socket connection
        this.socket.on("connect", () => {
            this.components.logHTML('<span class="text-blue">Socket</span> <span class="text-success">Connected</span> (raspberry pi server)');
        });

        this.socket.on("disconnect", () => {
            this.components.logHTML('<span class="text-blue">Socket</span> <span class="text-danger">Disconnected</span> (raspberry pi server)');
        });
    }

    handleData(data, callback) {
        // Keep 1 decimal
        data.altitude = Number(data.altitude).toFixed(1);
        data.speed = Number(data.speed).toFixed(1);
        data.acceleration = Number(data.acceleration).toFixed(1);
        data.pitch = Number(data.pitch).toFixed(1);
        data.yaw = Number(data.yaw).toFixed(1);
        data.roll = Number(data.roll).toFixed(1);
        if (this.config.logDataToConsole) {
            console.log(data);
        }
        callback(data);
    }

    updateConfig(config) {
        this.config = Object.assign(this.config, config);
    }
}