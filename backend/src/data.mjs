import EventEmitter from "node:events";
import {Buffer} from "node:buffer";
import chalk from "chalk";
import logger from "./utils/logger.mjs";
import MyStorage from "./storage.mjs";

export default class MyData extends EventEmitter {
    stringDataBuffer = "";
    dataBuffer = Buffer.alloc(0);
    startDataTime = Date.now();
    // startDataTime = Date.now() - Number(Date.now().toString().substring(7));
    lastDataTime = Date.now();

    // apogee = 0;
    // apogeeReached = false;
    // apogeeTime = 0;

    constructor({
                    encoding: encoding = "utf-8",
                    lineStart: lineStart = "$",
                    lineEnding = "\n",
                    dataInterval: dataInterval = 100,
                } = {}) {
        super();

        this.bd = new MyStorage(null);

        this.encoding = encoding;
        this.lineStart = lineStart;
        this.lineEnding = lineEnding;
        this.dataInterval = dataInterval;

        this.spdLastTime = Date.now(); // For speed calculation
        this.spdLastAltitude; // For speed calculation
    }

    // Extract a line of data
    // data: Buffer
    handleRawData(data) {
        // Add data to buffer
        this.dataBuffer = Buffer.concat([this.dataBuffer, data]);
        // 10 kb
        // if (this.dataBuffer.length > 10000) {
        //     this.dataBuffer = Buffer.alloc(0);
        // }

        // Keep everything between line start and line ending
        const start = this.dataBuffer.indexOf(this.lineStart);
        const end = this.dataBuffer.indexOf(this.lineEnding, start + 1);

        if (start !== -1 && end !== -1) {
            const line = this.dataBuffer.subarray(start, end + 1); // Extract line
            this.dataBuffer = this.dataBuffer.subarray(end + 1); // Remove line from buffer
            this.handleDataLine(line);
        }
    }

    // Extract values from a packet of data
    handleDataLine(line) {
        // Skip data if under threshold
        if (Date.now() - this.lastDataTime < this.dataInterval) {
            return;
        } else {
            this.lastDataTime = Date.now();
        }

        // console.log(line);

        // 0: PREFLIGHT, 1: INFLIGHT, 2: POSTFLIGHT, 3: DEBUG
        const flightMode = line[1] >> 6;

        if (flightMode !== 0 && flightMode !== 1 && flightMode !== 2 && flightMode !== 3) {
            this.emit("dataEvent", {
                type: "error",
                error: "flight mode is unknown (not 0, 1, 2 or 3)",
            });
            logger(chalk.blue("Data"), chalk.red("flight mode is unknown (not 0, 1, 2 or 3)"));
            return;
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
                    type: "error",
                    error: `wrong packet length (${line.length} bytes instead of ${prefligthPacketLength})`,
                });
                logger(
                    chalk.blue("Data"),
                    chalk.red(`wrong packet length (${line.length} bytes instead of ${prefligthPacketLength})`)
                );
                return;
            }

            // const crc = line.subarray(56, 58);
            // console.log(crc);

            dataDict = {
                flightMode: flightMode,
                statIgniter1: (line[1] >> 5) & 1, // 1: ok, 0: error
                statIgniter2: (line[1] >> 4) & 1, // 1: ok, 0: error
                statAccelerometer: (line[1] >> 3) & 1, // 1: ok, 0: error
                statBarometer: (line[1] >> 2) & 1, // 1: ok, 0: error
                // statGPS: (line[1] >> 1) & 1, // 1: ok, 0: error
                gps_fix: (line[1] >> 1) & 1, // 1: ok, 0: error
                statSD: line[1] & 1, // 1: ok, 0: error

                temperature: line.subarray(2, 6).readFloatBE(),
                altitude: line.subarray(6, 10).readFloatBE(),
                roll: line.subarray(10, 14).readFloatBE(),
                pitch: line.subarray(14, 18).readFloatBE(),
                lipo1_mV: line.subarray(22, 24).readUInt16BE(),
                lipo2_mV: line.subarray(24, 26).readUInt16BE(),
                lipo3_mV: line.subarray(26, 28).readUInt16BE(),
                AN_mV: line.subarray(28, 30).readUInt16BE(), // Not used
            };
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
                    type: "error",
                    error: `wrong packet length (${line.length} bytes instead of ${fligthPacketLength})`,
                });
                logger(
                    chalk.blue("Data"),
                    chalk.red(`wrong packet length (${line.length} bytes instead of ${fligthPacketLength})`)
                );
                return;
            }

            // const crc = line.subarray(56, 58);
            // console.log(crc);

            dataDict = {
                flightMode: flightMode,
                statIgniter1: (line[1] >> 5) & 1, // 1: ok, 0: error
                statIgniter2: (line[1] >> 4) & 1, // 1: ok, 0: error
                statAccelerometer: (line[1] >> 3) & 1, // 1: ok, 0: error
                statBarometer: (line[1] >> 2) & 1, // 1: ok, 0: error
                // statGPS: (line[1] >> 1) & 1, // 1: ok, 0: error
                gps_fix: (line[1] >> 1) & 1, // 1: ok, 0: error
                statSD: line[1] & 1, // 1: ok, 0: error

                altitude: line.subarray(2, 6).readFloatBE(),
                temperature: line.subarray(6, 10).readFloatBE(),
                latitude: line.subarray(14, 18).readFloatBE(),
                longitude: line.subarray(18, 22).readFloatBE(),
                accelerationX: line.subarray(34, 38).readFloatBE(),
                accelerationY: line.subarray(38, 42).readFloatBE(),
                accelerationZ: line.subarray(42, 46).readFloatBE(),
                roll: line.subarray(46, 50).readFloatBE(),
                pitch: line.subarray(50, 54).readFloatBE(),
            };
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
                    type: "error",
                    error: `wrong packet length (${line.length} bytes instead of ${postfligthPacketLength})`,
                });
                logger(
                    chalk.blue("Data"),
                    chalk.red(`wrong packet length (${line.length} bytes instead of ${postfligthPacketLength})`)
                );
                return;
            }

            // const crc = line.subarray(32, 34);
            // console.log(crc);

            dataDict = {
                flightMode: flightMode,
                statIgniter1: (line[1] >> 5) & 1, // 1: ok, 0: error
                statIgniter2: (line[1] >> 4) & 1, // 1: ok, 0: error
                statAccelerometer: (line[1] >> 3) & 1, // 1: ok, 0: error
                // statGPS: (line[1] >> 1) & 1, // 1: ok, 0: error
                gps_fix: (line[1] >> 1) & 1, // 1: ok, 0: error
                statGPS: (line[1] >> 1) & 1, // 1: ok, 0: error
                statSD: line[1] & 1, // 1: ok, 0: error

                altitude: line.subarray(2, 6).readFloatBE(),
                latitude: line.subarray(10, 14).readFloatBE(),
                longitude: line.subarray(14, 18).readFloatBE(),
                mVLipo1: line.subarray(18, 20).readUInt16BE(),
                mVLipo2: line.subarray(20, 22).readUInt16BE(),
                mVLipo3: line.subarray(22, 24).readUInt16BE(),
                mVAN: line.subarray(24, 26).readUInt16BE(),
            };
        }

        if (dataDict === undefined) {
            this.emit("dataEvent", {
                type: "error",
                error: "cannot parse data",
            });
            logger(chalk.blue("Data"), chalk.red("cannot parse data"));
            return;
        }

        // console.log(dataDict);

        dataDict = this.standarizeData(dataDict);

        this.validateData(dataDict);

        this.bd.writeFormattedData(dataDict);
        this.emit("data", this.bd.getLastInput());
    }

    // Fill predefined fields with data
    standarizeData(data) {
        let stdData = {};

        // Time of data in seconds
        stdData.time = numberPrecision((Date.now() - this.startDataTime) / 1000, 3);

        // Flight mode (0: PREFLIGHT, 1: INFLIGHT, 2: POSTFLIGHT)
        stdData.flightMode = data.flightMode !== undefined ? data.flightMode : null;
        // Igniter status (0: ERROR, 1: CONTINUITY)
        stdData.statIgniter1 = data.statIgniter1 !== undefined ? data.statIgniter1 : null;
        stdData.statIgniter2 = data.statIgniter2 !== undefined ? data.statIgniter2 : null;
        stdData.statIgniter3 = data.statIgniter3 !== undefined ? data.statIgniter3 : null;
        stdData.statIgniter4 = data.statIgniter4 !== undefined ? data.statIgniter4 : null;
        // Accelerometer status (0: ERROR, 1: OK)
        stdData.statAccelerometer = data.statAccelerometer !== undefined ? data.statAccelerometer : null;
        // Barometer status (0: ERROR, 1: OK)
        stdData.statBarometer = data.statBarometer !== undefined ? data.statBarometer : null;
        // GPS status (0: ERROR, 1: OK)
        stdData.statGPS = data.statGPS !== undefined ? data.statGPS : null;
        // SD card status (0: ERROR, 1: OK)
        stdData.statSD = data.statSD !== undefined ? data.statSD : null;

        // Temperature of barometer in Celsius
        stdData.temperature = data.temperature !== undefined ? numberPrecision(data.temperature, 2) : null;
        // Altitude from barometer in meters
        stdData.altitude = data.altitude !== undefined ? numberPrecision(data.altitude, 2) : null;
        stdData.altitude_ft = data.altitude !== undefined ? numberPrecision(data.altitude * 3.28084, 2) : null;
        // Vertical speed in m/s
        // stdData.speed = data.speed !== undefined ? numberPrecision(data.speed, 2) : null;
        stdData.speed = numberPrecision(
            (data.altitude - this.spdLastAltitude) / ((Date.now() - this.spdLastTime) / 1000),
            2
        ); // Avg speed
        this.spdLastAltitude = stdData.altitude;
        this.spdLastTime = Date.now();
        // Highest acceleration in m/s
        stdData.acceleration = Math.max(data.accelerationX, data.accelerationY, data.accelerationZ);
        stdData.acceleration = stdData.acceleration !== NaN ? numberPrecision(stdData.acceleration, 2) : null;
        // GPS Fix (0: NO FIX, 1: FIX)
        stdData.gps_fix = data.gps_fix !== undefined ? data.gps_fix : null;
        // Latitude from GPS in degrees
        stdData.latitude = data.latitude !== undefined ? numberPrecision(data.latitude, 8) : null;
        // Longitude from GPS in degrees
        stdData.longitude = data.longitude !== undefined ? numberPrecision(data.longitude, 8) : null;
        // Pitch of the rocket in degrees
        stdData.pitch = data.pitch !== undefined ? numberPrecision(data.pitch, 2) : null;
        // Yaw of the rocket in degrees
        stdData.yaw = data.yaw !== undefined ? numberPrecision(data.yaw, 2) : null;
        // Roll of the rocket in degrees
        stdData.roll = data.roll !== undefined ? numberPrecision(data.roll, 2) : null;
        // Battery 1 voltage in mV
        stdData.batt1_mV = data.lipo1_mV !== undefined ? numberPrecision(data.lipo1_mV, 0) : null;
        // Battery 2 voltage in mV
        stdData.batt2_mV = data.lipo2_mV !== undefined ? numberPrecision(data.lipo2_mV, 0) : null;
        // Battery 3 voltage in mV
        stdData.batt3_mV = data.lipo3_mV !== undefined ? numberPrecision(data.lipo3_mV, 0) : null;

        // console.log(stdData);

        return stdData;
    }

    validateData(data) {
        // TODO
        return;
    }

    // Extract a line of data
    // data: Buffer
    handleRawMockData(data) {
        // Add data to buffer
        this.stringDataBuffer += data.toString("utf-8");

        if (this.stringDataBuffer.includes("\n")) {
            // Keep text before line ending
            const line = this.stringDataBuffer.split("\n")[0];
            // Remove text before line ending from buffer to avoid processing it twice
            this.stringDataBuffer = this.stringDataBuffer.split("\n")[1];
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

        const dataList = line.trim().split(",");

        const dataDict = {
            // "time": dataList[0],
            time: (Date.now() - this.startDataTime) / 1000,
            altitude: dataList[1],
            pitch: dataList[2],
            roll: dataList[3],
            yaw: dataList[4],
            lat: dataList[5],
            lon: dataList[6],
            speed: dataList[7],
            acceleration: dataList[8],
            temperature: dataList[9],
            vibrations: dataList[10],
            landing_force: dataList[11],
            batt_check: dataList[12],
            igniter_check: dataList[13],
            statGPS: dataList[14],
        };
        this.bd.writeFormattedData(dataDict);
        this.emit("data", dataDict);
    }
}

function numberPrecision(value, precision) {
    return Number(Number(value).toFixed(precision));
}
