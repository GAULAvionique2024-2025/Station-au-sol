/**
 * Main entry point of the server.
 */

import MyWebServer from "./src/webserver.mjs";
import MyStorage from "./src/storage.mjs";
import MySocket from "./src/socket.mjs";
import MySerial from "./src/serial.mjs";
import MyData from "./src/data.mjs";

import myLogger from "./src/logger.mjs"; // Singleton
const logger = myLogger.getCustomLogger();

const DEV_MODE = process.argv.includes("--dev");
const MOCK_MODE = process.argv.includes("--mock");

class App {
    constructor() {
        this.webServer = new MyWebServer();
        this.storage = new MyStorage();
        this.socket = new MySocket({
            HTTPServer: this.webServer.getHTTPServer(),
            // Allow connections to the socket from port 5173 if dev mode enabled
            corsEnabled: DEV_MODE,
        });
        this.serial = new MySerial({
            path: "COM3", // Windows
            // 'path': "/dev/ttyUSB0", // Raspberry Pi
            mockPort: MOCK_MODE, // Create a testing serial port is mock mode is enabled
        });
        this.logger = myLogger;
        this.data = new MyData();

        this.eventListeners();
    }

    eventListeners() {
        // Raw data from the serial port
        // data: string
        this.serial.on("rawData", (data) => {
            // Add raw data to a file
            this.storage.writeRaw(data);
            // Handle data
            if (MOCK_MODE) {
                this.data.handleRawMockData(data);
            } else {
                this.data.handleRawData(data);
            }
        });

        // Formatted data from the data handler
        // data: dictionary
        this.data.on("data", (data) => {
            // Add formatted data to a csv file
            this.storage.writeFormatted(data);
            // Send data to clients
            this.socket.sendData(data);
        });

        // Log events from the logger
        this.logger.on("log", (log) => {
            // Send logs to clients
            this.socket.send("log", log);
        });

        this.logger.on("test", (data) => {
            console.log("Test event emitted", data);
        });

        // Client requests available serial paths
        this.socket.on("getAvailablePaths", (callback) => {
            this.serial.getAvailablePaths().then((paths) => {
                // Send available serial paths to the client
                callback({
                    availablePaths: paths,
                    currentPath: this.serial.path,
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

if (DEV_MODE) {
    logger.info("Developpment server (cors enabled)");
}

const app = new App();
