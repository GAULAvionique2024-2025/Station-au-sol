import { io } from "socket.io-client";

let socket;

function createSocket() {
    if (socket) {
        console.log("Socket already exists");
        return;
    }

    // Connect to backend (port 80) when not in production
    const URL = process.env.NODE_ENV === "production" ? undefined : ":80";
    socket = io(URL);
}

export function getSocket() {
    if (!socket) {
        createSocket();
    }
    return socket;
}