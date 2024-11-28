import EventEmitter from "node:events";
import { SerialPort } from "serialport";
import chalk from "chalk";
import { startSerialMock } from "./utils/serialmock.mjs";
import logger from "./utils/logger.mjs";

export default class MySerial extends EventEmitter {
    serialConnected = false;
    serialPort;
    lastEventError;

    constructor({
        // 'path': path = "COM3", // Windows
        path: path = "/dev/ttyUSB0", // Raspberry Pi
        baudRate: baudRate = 9600,
        encoding: encoding = "utf-8",
        mockPort: mockPort = false,
        reconnectSerialTimeout: reconnectSerialTimeout = 1000,
    } = {}) {
        super();

        // Serial port settings
        this.path = path;
        this.baudRate = baudRate;

        // Other settings
        this.encoding = encoding;
        this.mockPort = mockPort;
        this.reconnectSerialTimeout = reconnectSerialTimeout;

        // Set testing path if there is a mock port
        this.path = this.mockPort ? "testingPort" : this.path;

        this.startSerial();
    }

    startSerial() {
        if (this.serialConnected) {
            return;
        }

        if (this.path === "testingPort") {
            this.serialPort = startSerialMock();
        } else {
            this.serialPort = new SerialPort({ path: this.path, baudRate: this.baudRate });
        }

        this.setupEvents();
    }

    // Listen to serial port events
    setupEvents() {
        this.serialPort.on("data", (data) => {
            this.emit("rawData", data);
        });

        this.serialPort.on("open", () => {
            this.serialConnected = true;

            this.lastEventError = null;

            logger.info(`Opened on ${chalk.blue(this.path)} at ${chalk.blue(this.baudRate)}`, { label: "Serial" });
            // Send to clients
            this.emit("serialEvent", {
                type: "opened",
                path: this.path,
                baudRate: this.baudRate,
            });
        });

        this.serialPort.on("close", (event) => {
            this.serialConnected = false;

            logger.warn(
                `Closed (${chalk.blue(this.path)} at ${chalk.blue(this.baudRate)}) ${event ? chalk.italic(event) : ""}`,
                {
                    label: "Serial",
                }
            );
            // Send to clients
            this.emit("serialEvent", {
                type: "closed",
                event: event ? event.toString() : "No description",
            });

            // Try to reconnect
            setTimeout(() => {
                this.startSerial();
            }, this.reconnectSerialTimeout);
        });

        this.serialPort.on("error", (error) => {
            this.serialConnected = false;

            if (error.toString() != this.lastEventError) {
                logger.error(error, { label: "Serial" });

                // Send to clients
                this.emit("serialEvent", {
                    type: "error",
                    error: error ? error.toString() : "No description",
                });
            }

            this.lastEventError = error.toString();

            // Try to reconnect
            setTimeout(() => {
                this.startSerial();
            }, this.reconnectSerialTimeout);
        });
    }

    // Update the serial port settings
    updateSettings({ path: path = this.path, baudRate: baudRate = this.baudRate }) {
        this.path = path;
        this.baudRate = baudRate;

        logger.info(`New settings: ${chalk.blue(path)} at ${chalk.blue(baudRate)}`, { label: "Serial" });
        this.serialPort.close();
        this.serialConnected = false;
        // It will reconnect automatically with events
    }

    // Get all the serial paths available
    async getAvailablePaths() {
        try {
            const ports = await SerialPort.list();
            const paths = ports.map((port) => port.path);
            if (this.mockPort) paths.push("testingPort");
            return paths;
        } catch (error) {
            logger.error(`Error getting serial ports: ${error}`, { label: "Serial" });
            return [];
        }
    }
}
