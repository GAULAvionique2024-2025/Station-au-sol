/**
 * Module to receive or send data to the server
 * - Handle socket connections
 * - Update components with the data received from the server
 * - Update the server config
 * @module Socket
 */

import { io } from "socket.io-client";

export default class Socket {
    constructor({
        'states': states = {},
        'config': config = {},
        'components': components = null,
    } = {}) {
        // Application states
        this.states = states;
        // Default module config from app.js
        this.config = Object.assign({
            'logSerialDataToConsole': true,
            'logSerialEventsToConsole': true,
        }, config);

        // To access and update the components
        this.components = components;

        // Initialize the socket
        this.socket = io(":80");

        this.setupEvents();
    }

    setupEvents() {
        // Update components with serial data from the server
        this.socket.on("data", (data) => {
            this.handleData(data, (data) => {
                this.components.updateAll(data);
            })
        });

        // Log serial events from the server
        this.socket.on("serialEvent", (event) => {
            if (this.config.logSerialEventsToConsole) {
                console.log("SerialEvent", event);
            }

            if (event.type == "opened") {
                this.components.logHTML('<span class="text-blue">Serial</span> <span class="text-success">Connected</span> (raspberry pi antenna)');
            } else if (event.type == "closed") {
                this.components.logHTML('<span class="text-blue">Serial</span> <span class="text-danger">Disconnected (Closed)</span> (raspberry pi antenna)');
            } else if (event.type == "error") {
                let msg = "";
                if (event.error.includes("Access denied")) {
                    msg = "Access denied";
                } else if (event.error.includes("File not found")) {
                    msg = "Path not found";
                }
                this.components.logHTML(`<span class="text-blue">Serial</span> <span class="text-danger">Disconnected (${msg})</span> (raspberry pi antenna)`);
            }
        });

        // Log socket events
        this.socket.on("connect", () => {
            this.components.logHTML('<span class="text-blue">Socket</span> <span class="text-success">Connected</span> (raspberry pi server)');
        });

        this.socket.on("disconnect", () => {
            this.components.logHTML('<span class="text-blue">Socket</span> <span class="text-danger">Disconnected</span> (raspberry pi server)');
        });

        this.socket.on("connect_error", () => {
            // Try to reconnect
            this.socket.connect();
            this.components.logHTML(`<span class="text-blue">Socket</span> <span class="text-danger">Disconnected</span> (raspberry pi server)`);
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
        if (this.config.logSerialDataToConsole) {
            console.log(data);
        }
        callback(data);
    }

    getAvailablePaths(callback) {
        this.socket.emit("getAvailablePaths", null, (paths) => {
            callback(paths);
        });
    }

    setNewSettings(settings) {
        this.socket.emit("newSettings", settings);
    }
}