/**
 * Main entry point of the server.
 */

import MyWebServer from "./lib/webserver.mjs";
import MyStorage from "./lib/storage.mjs";
import MySocket from "./lib/socket.mjs";
import MySerial from "./lib/serial.mjs";

class App {
    constructor() {
        this.webServer = new MyWebServer();
        this.storage = new MyStorage();
        this.socket = new MySocket(this.webServer.getHTTPServer());
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