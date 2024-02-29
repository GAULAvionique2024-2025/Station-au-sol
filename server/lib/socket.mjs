import EventEmitter from 'node:events';
import { Server } from 'socket.io';

export default class MySocket extends EventEmitter {
    // 'HTTPServer' is the HTTP server of the Express application
    constructor(HTTPServer) {
        super();
        this.io = new Server(HTTPServer);

        this.initClientEvents();
    }

    // Listen to client events
    initClientEvents() {
        this.io.on("connection", (socket) => {
            // Send available serial paths to the client
            socket.on('getAvailablePaths', (args, callback) => {
                // Handle the event in main.mjs
                this.emit('getAvailablePaths', callback);
            });

            // New settings from client
            socket.on('newSettings', (settings) => {
                // Handle the event in main.mjs
                this.emit('newSettings', settings);
            });
        });
    }

    // Send data to the client
    sendData(data) {
        this.io.emit('data', data);
    }

    // Send events to the client
    send(event, desc = null) {
        this.io.emit(event, desc);
    }
}