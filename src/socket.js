import { io } from "socket.io-client";

let socket;

function createSocket() {
    if (socket) {
        console.log("Socket already exists");
        return;
    }

    const URL = process.env.NODE_ENV === "production" ? undefined : ":80";
    socket = io(URL);
}

export function getSocket() {
    if (!socket) {
        createSocket();
    }
    return socket;
}