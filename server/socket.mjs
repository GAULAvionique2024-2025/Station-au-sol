import { Server } from 'socket.io';

export default class MySocket {
    // 'HTTPServer' is the HTTP server of the Express application
    // 'Serial' is the MySerial instance
    constructor(HTTPServer) {
        this.io = new Server(HTTPServer);

        this.availablePaths = [];
        this.path = "";

        this.initClientEvents();
    }

    // To allow other modules to set the available paths
    setAvailablePaths(paths) {
        this.availablePaths = paths;
    }

    // Listen to client events
    initClientEvents() {
        this.io.on("connection", (socket) => {
            // Send the available paths to the client
            socket.on('get-paths', (arg, callback) => {
                callback({
                    'availablePaths': this.availablePaths,
                    'path': this.path,
                });
            });

            // Set the serial path
            socket.on('set-path', (path) => {
                this.path = path;
            });
        });
    }

    // Send data to the client
    sendData(data) {
        this.io.emit('data', data);
    }

    // Send events to the client
    send(event, data = "") {
        this.io.emit(event, data);
    }
}