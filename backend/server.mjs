/**
 * Main entry point of the server.
 */

import MyWebServer from "./src/webserver.mjs";
import MyStorage from "./src/storage.mjs";
import MySocket from "./src/socket.mjs";
import MySerial from "./src/serial.mjs";

class App {
    constructor() {
        this.webServer = new MyWebServer({
            // Don't serve /dist files if dev mode enabled
            'serveStaticFiles': !process.argv.includes("--dev"),
        });
        this.storage = new MyStorage();
        this.socket = new MySocket({
            'HTTPServer': this.webServer.getHTTPServer(),
            // Allow connections to the socket from port 5173 if dev mode enabled
            'corsEnabled': process.argv.includes("--dev"),
        });
        this.serial = new MySerial({
            'path': "COM3",
            'reconnectSerialTimeout': 2000,
        });

        this.eventListeners();
    }

    eventListeners() {
        // Raw data from the serial port
        this.serial.on("rawData", (data) => {
            // Add raw data to a text file
            this.storage.writeRaw(data);
        });

        // Formatted data from the serial port
        this.serial.on("data", (data) => {
            // Add formatted data to a csv file
            this.storage.writeFormatted(data);
            // Send data to clients
            this.socket.sendData(data);
        });

        // Events from the serial port
        this.serial.on("serialEvent", (event) => {
            // Send events to clients
            this.socket.send("serialEvent", event);
        });

        // Client requests available serial paths
        this.socket.on("getAvailablePaths", (callback) => {
            this.serial.getAvailablePaths().then((paths) => {
                // Send available serial paths to the client
                callback({
                    'availablePaths': paths,
                    'currentPath': this.serial.path,
                });
            });
        });

        // Client sends new settings
        this.socket.on("newSettings", (settings) => {
            // Update serial port settings
            this.serial.updateSettings(settings);
        });
    }
}

const app = new App();