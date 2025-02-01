import { io } from "socket.io-client";

const DEV_PORT = ":8080"; // MOVE TO CONFIG FILE

let socket;

function createSocket() {
    if (socket) {
        console.log("Socket already exists");
        return;
    }

    // Connect to backend (port 8030) when not in production
    const URL = process.env.NODE_ENV === "production" ? undefined : DEV_PORT;
    socket = io(URL);
}

export function getSocket() {
    if (!socket) {
        createSocket();
    }
    return socket;
}
