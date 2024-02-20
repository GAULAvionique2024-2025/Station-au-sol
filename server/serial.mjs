import EventEmitter from 'node:events';
import { SerialPort } from "serialport";
import chalk from 'chalk';
import logger from './logger.mjs';

export default class MySerial extends EventEmitter {
    serialTextBuffer = "";
    // serialConnected = false;
    serialPort;

    constructor({
        'path': path = "COM3", // '/dev/ttyS0' for raspberry pi
        'baudRate': baudRate = 115200,
        'encoding': encoding = "utf-8",
        'reconnectSerialTimeout': reconnectSerialTimeout = 1000,
        'lineEnding': lineEnding = '\n',
        'valueSeparator': valueSeparator = ',',
    } = {}) {
        super();

        this.serialConnected = false;

        // Serial port settings
        this.path = path;
        this.baudRate = baudRate;
        this.encoding = encoding;

        // Other settings
        this.reconnectSerialTimeout = reconnectSerialTimeout;
        this.lineEnding = lineEnding;
        this.valueSeparator = valueSeparator;

        this.startSerial();
    }

    startSerial() {
        if (this.serialConnected) {
            return;
        }

        this.serialPort = new SerialPort({ path: this.path, baudRate: this.baudRate });

        this.setupEvents();
    }

    // Listen to serial port events
    setupEvents() {
        this.serialPort.on("data", (data) => {
            this.emit("rawData", data.toString(this.encoding));
            this.extractDataLine(data);
        });

        this.serialPort.on("open", () => {
            this.serialConnected = true;

            logger(chalk.blue("Serial port"), chalk.green("opened"), `on ${chalk.yellow(this.path)} at ${chalk.yellow(this.baudRate)}`);
            // Send to clients
            this.emit("serialEvent", {
                "type": "opened",
                "path": this.path,
                "baudRate": this.baudRate,
            });
        });

        this.serialPort.on("close", (event) => {
            this.serialConnected = false;

            logger(chalk.blue("Serial port"), chalk.red("closed"), event ? chalk.italic(event) : "");
            // Send to clients
            this.emit("serialEvent", {
                "type": "closed",
                "event": event ? event.toString() : "No description",
            });

            // Try to reconnect
            setTimeout(() => {
                this.startSerial();
            }, this.reconnectSerialTimeout);
        });

        this.serialPort.on("error", (error) => {
            this.serialConnected = false;

            logger(chalk.blue("Serial port"), chalk.red("error"), chalk.italic(error));
            // Send to clients
            this.emit("serialEvent", {
                "type": "error",
                "error": error ? error.toString() : "No description",
            });

            // Try to reconnect
            setTimeout(() => {
                this.startSerial();
            }, this.reconnectSerialTimeout);
        });
    }

    // Extract a line of data
    extractDataLine(dataBuffer) {
        // Add data to buffer
        this.serialTextBuffer += dataBuffer.toString(this.encoding);

        if (this.serialTextBuffer.includes(this.lineEnding)) {
            // Keep text before line ending
            const line = this.serialTextBuffer.split(this.lineEnding)[0];
            // Remove text before line ending from buffer to avoid processing it twice
            this.serialTextBuffer = this.serialTextBuffer.split(this.lineEnding)[1];
            // Handle the line of data
            this.handleDataLine(line);
        }
    }

    // Create a uniform JSON with the data, then send it to the main app
    handleDataLine(dataStr) {
        const dataList = dataStr.trim().split(this.valueSeparator);

        // VALIDATION (TO COMPLETE)
        if (dataList.length != 15) {
            return;
        }

        const dataDict = {
            "time": dataList[0],
            "altitude": dataList[1],
            "pitch": dataList[2],
            "roll": dataList[3],
            "yaw": dataList[4],
            "lat": dataList[5],
            "lon": dataList[6],
            "speed": dataList[7],
            "acceleration": dataList[8],
            "temperature": dataList[9],
            "vibrations": dataList[10],
            "landing_force": dataList[11],
            "batt_check": dataList[12],
            "igniter_check": dataList[13],
            "gps_check": dataList[14],
        }

        // Send to the main app
        this.emit("data", dataDict);
    }

    // Update the serial port settings
    updateSettings({
        'path': path = this.path,
        'baudRate': baudRate = this.baudRate,
    }) {
        this.path = path;
        this.baudRate = baudRate;

        logger(chalk.blue("Serial port"), "new settings:", chalk.yellow(path), "at", chalk.yellow(baudRate));
        this.serialPort.close();
        this.serialConnected = false;
        // It will reconnect with the new settings
        this.startSerial();
    }

    // Get all the serial paths available
    async getAvailablePaths() {
        const ports = await SerialPort.list();
        const paths = ports.map(port => port.path);
        return paths;
    }
}