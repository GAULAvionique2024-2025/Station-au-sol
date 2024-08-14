import EventEmitter from 'node:events';
import { Buffer } from 'node:buffer';
import chalk from 'chalk';
import logger from './utils/logger.mjs';

export default class MyData extends EventEmitter {
    stringDataBuffer = "";
    dataBuffer = Buffer.alloc(0);
    lastDataTime = Date.now();
    startDataTime = Date.now() - Number(Date.now().toString().substring(8));

    apogee = 0;
    apogeeReached = false;
    apogeeTime = 0;

    constructor({
        'encoding': encoding = "utf-8",
        'lineStart': lineStart = '$',
        'dataInterval': dataInterval = 100,
    } = {}) {
        super();

        this.encoding = encoding;
        this.lineStart = lineStart;
        this.dataInterval = dataInterval;
    }

    // Extract a line of data
    // data: Buffer
    handleRawData(data) {
        // Add data to buffer
        this.dataBuffer = Buffer.concat([this.dataBuffer, data]);

        // 10 kb
        if (this.dataBuffer.length > 10000) {
            this.dataBuffer = Buffer.alloc(0);
        }

        const index = this.dataBuffer.indexOf(this.lineStart, 1);

        if (index != -1) {
            const line = this.dataBuffer.subarray(0, index);
            this.dataBuffer = this.dataBuffer.subarray(index);
            this.handleDataLine(line);
        }
    }

    handleDataLine(line) {
        // Skip data if under threshold
        if (Date.now() - this.lastDataTime < this.dataInterval) {
            return;
        } else {
            this.lastDataTime = Date.now();
        }

        // console.log(line);

        // TESTS

        // 0: PREFLIGHT, 1: INFLIGHT, 2: POSTFLIGHT, 3: DEBUG
        const flightMode = line[1] >> 6;

        if (![0, 1, 2, 3].includes(flightMode)) {
            this.emit("dataEvent", {
                "type": "error",
                "error": "flight mode is unknown (not 0, 1, 2 or 3)",
            });
            logger(chalk.blue("Data"), chalk.red("flight mode is unknown (not 0, 1, 2 or 3)"));
        }

        let dataDict;

        // // Maybe LE instead of BE (for readUInt16BE)

        // Header(8bit): Mode(2bit)Igniter1(1bit)Igniter2(1bit)Accelerometer(1bit)Barometer(1bit)Gps(1bit)SD(1bit)

        // PREFLIGHT (34 bytes)
        //
        // $(char8bit) (0)
        // Header(8bit) (1)
        // Altitude(m)(float32bit) (2) [0]
        // Temp(°C)(float32bit) (6) [4]
        // AngleRoll(°)(float32bit) (10) [8]
        // AnglePitch(°)(float32bit) (14) [12]
        // NULL(32bit) (18) [16]
        // V_Lipo1(mV)(uint16bit) (22) [20]
        // V_Lipo2(mV)(uint16bit) (24) [22]
        // V_Lipo3(mV)(uint16bit) (26) [24]
        // 5V_AN(mV)(uint16bit) (28) [26]
        // *(char8bit) (30)
        // CRC(16bit) (31)
        // <LF>(char8bit) (33)

        if (flightMode === 0) {
            // Packet length validation
            const prefligthPacketLength = 34;
            if (line.length !== prefligthPacketLength) {
                this.emit("dataEvent", {
                    "type": "error",
                    "error": `wrong packet length (${line.length} bytes instead of ${prefligthPacketLength})`,
                });
                logger(chalk.blue("Data"), chalk.red(`wrong packet length (${line.length} bytes instead of ${prefligthPacketLength})`));
                return;
            }

            // const crc = line.subarray(56, 58);
            // console.log(crc);

            dataDict = {
                "time": (Date.now() - this.startDataTime) / 1000,
                "flightMode": flightMode,
                "statIgniter1": line[1] >> 5 & 1, // 1: ok, 0: error
                "statIgniter2": line[1] >> 4 & 1, // 1: ok, 0: error
                "statAccelerometer": line[1] >> 3 & 1, // 1: ok, 0: error
                "statBarometer": line[1] >> 2 & 1, // 1: ok, 0: error
                "statGPS": line[1] >> 1 & 1, // 1: ok, 0: error
                "statSD": line[1] & 1, // 1: ok, 0: error
                "temperature": line.subarray(2, 6).readFloatBE(),
                "altitude": line.subarray(6, 10).readFloatBE(),
                "roll": line.subarray(10, 14).readFloatBE(),
                "pitch": line.subarray(14, 18).readFloatBE(),
                "mVLipo1": line.subarray(22, 24).readUInt16BE(),
                "mVLipo2": line.subarray(24, 26).readUInt16BE(),
                "mVLipo3": line.subarray(26, 28).readUInt16BE(),
                "mVAN": line.subarray(28, 30).readUInt16BE(),
            }
        }

        // INFLIGHT (58 bytes)
        //
        // $(char8bit) (0)
        // Header(8bit) (1)
        // Altitude(m)(float32bit) (2) [0]
        // Temp(°C)(float32bit) (6) [4]
        // Time_raw(HHMMSS)(int32bits) (10) [8] // NOT USED
        // Latitude(float32bit) (14) [12]
        // Longitude(float32bit) (18) [16]
        // GyroX(°)(float32bit) (22) [20]
        // GyroY(°)(float32bit) (26) [24]
        // GyroZ(°)(float32bit) (30) [28]
        // AccX(m/s²)(float32bit) (34) [32]
        // AccY(m/s²)(float32bit) (38) [36]
        // AccZ(m/s²)(float32bit) (42) [40]
        // KalmanAngleRoll(°)(float32bit) (46) [44]
        // KalmanAnglePitch(°)(float32bit) (50) [48]
        // *(char8bit) (54)
        // CRC(16bit) (55)
        // <LF>(char8bit) (57)

        if (flightMode === 1) {
            // Packet length validation
            const fligthPacketLength = 58;
            if (line.length !== fligthPacketLength) {
                this.emit("dataEvent", {
                    "type": "error",
                    "error": `wrong packet length (${line.length} bytes instead of ${fligthPacketLength})`,
                });
                logger(chalk.blue("Data"), chalk.red(`wrong packet length (${line.length} bytes instead of ${fligthPacketLength})`));
                return;
            }

            // const crc = line.subarray(56, 58);
            // console.log(crc);

            // console.log(line[15]);
            // const latitude_sign = line[15] == 78 ? 1 : -1; // 78 = 'N'
            // const latitude_dm = line.subarray(6, 15).toString(); // ddmm.mmmm
            // const latitude_d = latitude_dm.slice(0, 2);
            // const latitude_m = latitude_dm.slice(2);
            // const latitude = (Number(latitude_d) + Number(latitude_m) / 60) * latitude_sign

            // console.log(line[26]);
            // const longitude_sign = line[26].toString() == 69 ? 1 : -1; // 69 = 'E'
            // const longitude_dm = line.subarray(16, 26).toString(); // dddmm.mmmm
            // const longitude_d = longitude_dm.slice(0, 3);
            // const longitude_m = longitude_dm.slice(3);
            // const longitude = (Number(longitude_d) + Number(longitude_m) / 60) * longitude_sign


            dataDict = {
                "time": (Date.now() - this.startDataTime) / 1000,
                "flightMode": flightMode,
                "statIgniter1": line[1] >> 5 & 1, // 1: ok, 0: error
                "statIgniter2": line[1] >> 4 & 1, // 1: ok, 0: error
                "statAccelerometer": line[1] >> 3 & 1, // 1: ok, 0: error
                "statBarometer": line[1] >> 2 & 1, // 1: ok, 0: error
                "statGPS": line[1] >> 1 & 1, // 1: ok, 0: error
                "statSD": line[1] & 1, // 1: ok, 0: error
                "altitude": line.subarray(2, 6).readFloatBE(),
                "temperature": line.subarray(6, 10).readFloatBE(),
                // "lat": latitude,
                "lat": line.subarray(14, 18).readFloatBE(),
                // "lon": longitude,
                "lon": line.subarray(18, 22).readFloatBE(),
                "accelerationX": line.subarray(34, 38).readFloatBE(),
                "accelerationY": line.subarray(38, 42).readFloatBE(),
                "accelerationZ": line.subarray(42, 46).readFloatBE(),
                "roll": line.subarray(46, 50).readFloatBE(),
                "pitch": line.subarray(50, 54).readFloatBE(),
            }
        }

        // POSTFLIGHT (30 bytes)
        // $(char8bit) (0)
        // Header(8bit) (1)
        // Altitude(m)(float32bit) (2) [0]
        // Time_raw(HHMMSS)(int32bits) (6) [4] // NOT USED
        // Latitude(float32bit) (10) [8]
        // Longitude(float32bit) (14) [12]
        // V_Lipo1(mV)(uint16bit) (18) [16]
        // V_Lipo2(mV)(uint16bit) (20) [18]
        // V_Lipo3(mV)(uint16bit) (22) [20]
        // 5V_AN(mV)(uint16bit) (24) [22]
        // *(char8bit) (26)
        // CRC(16bit) (27)
        // <LF>(char8bit) (29)

        if (flightMode == 2) {
            // Packet length validation
            const postfligthPacketLength = 30;
            if (line.length !== postfligthPacketLength) {
                this.emit("dataEvent", {
                    "type": "error",
                    "error": `wrong packet length (${line.length} bytes instead of ${postfligthPacketLength})`,
                });
                logger(chalk.blue("Data"), chalk.red(`wrong packet length (${line.length} bytes instead of ${postfligthPacketLength})`));
                return;
            }

            // const crc = line.subarray(32, 34);
            // console.log(crc);

            // console.log(line[15]);
            // const latitude_sign = line[11] == 78 ? 1 : -1; // 78 = 'N'
            // const latitude_dm = line.subarray(2, 11).toString(); // ddmm.mmmm
            // const latitude_d = latitude_dm.slice(0, 2);
            // const latitude_m = latitude_dm.slice(2);
            // const latitude = (Number(latitude_d) + Number(latitude_m) / 60) * latitude_sign

            // console.log(line[26]);
            // const longitude_sign = line[22].toString() == 69 ? 1 : -1; // 69 = 'E'
            // const longitude_dm = line.subarray(12, 22).toString(); // dddmm.mmmm
            // const longitude_d = longitude_dm.slice(0, 3);
            // const longitude_m = longitude_dm.slice(3);
            // const longitude = (Number(longitude_d) + Number(longitude_m) / 60) * longitude_sign

            dataDict = {
                "time": (Date.now() - this.startDataTime) / 1000,
                "flightMode": flightMode,
                "statIgniter1": line[1] >> 5 & 1, // 1: ok, 0: error
                "statIgniter2": line[1] >> 4 & 1, // 1: ok, 0: error
                "statAccelerometer": line[1] >> 3 & 1, // 1: ok, 0: error
                "statBarometer": line[1] >> 2 & 1, // 1: ok, 0: error
                "statGPS": line[1] >> 1 & 1, // 1: ok, 0: error
                "statSD": line[1] & 1, // 1: ok, 0: error
                "altitude": line.subarray(2, 6).readFloatBE(),
                // "lat": latitude,
                "lat": line.subarray(10, 14).readFloatBE(),
                // "lon": longitude,
                "lon": line.subarray(14, 18).readFloatBE(),
                "mVLipo1": line.subarray(18, 20).readUInt16BE(),
                "mVLipo2": line.subarray(20, 22).readUInt16BE(),
                "mVLipo3": line.subarray(22, 24).readUInt16BE(),
                "mVAN": line.subarray(24, 26).readUInt16BE(),
            }
        }

        // console.log(dataDict)

        this.emit("data", dataDict);
    }

    // Extract a line of data
    // data: Buffer
    handleRawMockData(data) {
        // Add data to buffer
        this.stringDataBuffer += data.toString("utf-8");

        if (this.stringDataBuffer.includes('\n')) {
            // Keep text before line ending
            const line = this.stringDataBuffer.split('\n')[0];
            // Remove text before line ending from buffer to avoid processing it twice
            this.stringDataBuffer = this.stringDataBuffer.split('\n')[1];
            // Handle the line of data
            this.handleMockDataLine(line);
        }
    }

    handleMockDataLine(line) {
        // Skip data if under threshold
        if (Date.now() - this.lastDataTime < this.dataInterval) {
            return;
        } else {
            this.lastDataTime = Date.now();
        }

        const dataList = line.trim().split(',');

        const dataDict = {
            // "time": dataList[0],
            "time": (Date.now() - this.startDataTime) / 1000,
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
            "statGPS": dataList[14],
        }

        this.emit("data", dataDict);
    }
}