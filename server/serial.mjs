import { SerialPort } from "serialport";
import chalk from 'chalk';
import logger from './logger.mjs';

export default class MySerial {
    serialTextBuffer = "";
    serialConnected = false;
    serialPort;

    constructor(Socket, Storage, {
        'path': path = "COM3", // '/dev/ttyS0' for raspberry pi
        'baudRate': baudRate = 115200,
        'encoding': encoding = "utf-8",
        'reconnectSerialTimeout': reconnectSerialTimeout = 1000,
    } = {}) {
        // Classes from other modules
        this.socket = Socket;
        this.storage = Storage;

        // Serial port settings
        this.path = path;
        this.baudRate = baudRate;
        this.encoding = encoding;

        // Other settings
        this.reconnectSerialTimeout = reconnectSerialTimeout;

        this.startSerial();
    }

    startSerial() {
        this.serialPort = new SerialPort({ path: this.path, baudRate: this.baudRate });

        this.setupEvents();
    }

    setupEvents() {
        // Pass the data to this.handleSerialData()
        this.serialPort.on("data", (data) => {
            this.handleSerialData(data);
        });

        // On connection open
        this.serialPort.on("open", () => {
            this.serialConnected = true;
            // Log to console
            logger(chalk.blue("Serial port"), chalk.green("opened"), `on ${chalk.yellow(this.path)} at ${chalk.yellow(this.baudRate)}`);
            // Send to clients
            this.socket.send("serialEvent", {
                "type": "opened",
                "path": this.path,
                "baudRate": this.baudRate,
            });
        });

        // On connection close
        this.serialPort.on("close", (event) => {
            this.serialConnected = false;
            // Log to console
            logger(chalk.blue("Serial port"), chalk.red("closed"), chalk.italic(event));
            // Send to clients
            this.socket.send("serialEvent", {
                "type": "closed",
                "event": event ? event.toString() : "No description",
            });

            // Try to reconnect
            setTimeout(() => {
                this.startSerial();
            }, this.reconnectSerialTimeout);
        });

        // On error
        this.serialPort.on("error", (error) => {
            this.serialConnected = false;
            // Log to console
            logger(chalk.blue("Serial port"), chalk.red("error"), chalk.italic(error));
            // Send to clients
            this.socket.send("serialEvent", {
                "type": "error",
                "error": error ? error.toString() : "No description",
            });

            // Try to reconnect
            setTimeout(() => {
                this.startSerial();
            }, this.reconnectSerialTimeout);
        });
    }

    // Change the serial port path
    newSerialPath(path) {
        this.path = path;
        this.serialPort.update({ path: this.path });
        logger(chalk.blue("Serial port"), "new path:", chalk.yellow(path));
    }

    // Change the serial port baud rate
    newSerialBaudRate(baudRate) {
        this.baudRate = baudRate;
        this.serialPort.update({ baudRate: this.baudRate });
        logger(chalk.blue("Serial port"), "new baudRate:", chalk.yellow(path));
    }

    // Get all the serial ports available
    async getSerialPaths() {
        const ports = await SerialPort.list();
        const paths = ports.map(port => port.path);
        return paths;
    }

    // Extract a line of data (ending with "\n") (Could use readLine, but if the data is not ending with "\n", it will not work properly)
    handleSerialData(dataBuffer) {
        // Add the data to the buffer
        this.serialTextBuffer += dataBuffer.toString(this.encoding);
        if (this.serialTextBuffer.includes("\n")) {
            // Keep the text before "\n" to process it later
            const line = this.serialTextBuffer.split("\n")[0];
            // Remove the text before "\n" to avoid processing it twice
            this.serialTextBuffer = this.serialTextBuffer.split("\n")[1];
            this.handleDataLine(line);
        }

        // Write to file raw
        this.storage.writeRaw(dataBuffer.toString(this.encoding));
    }

    // Format data, then send it to the clients connected to socket
    handleDataLine(dataStr) {
        const dataList = dataStr.trim().split(",");

        // Skip incomplete data (TO EDIT)
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

        // Send to clients
        this.socket.sendData(dataDict);

        // Write to file formatted
        this.storage.writeFormatted(dataDict);
    }
}