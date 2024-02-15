import { Server } from 'socket.io';

export default class MySocket {
    // 'HTTPServer' is the HTTP server of the Express application
    constructor(HTTPServer) {
        this.io = new Server(HTTPServer);
    }

    // To allow other modules to send/receive data
    getIO() {
        return this.io;
    }

    sendData(data) {
        this.io.emit('data', data);
    }

    send(event, data = "") {
        this.io.emit(event, data);
    }
}