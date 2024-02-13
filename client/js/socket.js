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
        'components': components = {},
    } = {}) {
        this.states = states;
        this.components = components;
        this.socket = io();

        this.socket.on('data', (data) => {
            this.handleData(data, (data) => {
                this.components.update_all(data);
            })
        });

        this.socket.on("connect", () => {
            this.components.success("Socket Connected (raspberry pi server)");
        });

        this.socket.on("disconnect", () => {
            this.components.error("Socket Disconnected (raspberry pi server)");
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
        console.log(data);
        callback(data);
    }
}