import MyStorage from "../src/storage.mjs";
import MyData from "../src/data.mjs";
import fs from "fs";
import readline from 'readline'
import Config from "../src/utils/config.js";

function initiateTestDB() {
    const b = MyStorage.doesTableExists("Test_DB")
    if (!b) {
        const storage = new MyStorage("Test_DB");
        let first = true
        const rl = readline.createInterface({
            input: fs.createReadStream('../../DATA/Old_data_for_testing_purpose.csv'),
            output: process.stdout,
            terminal: false
        });

        rl.on('line', (line) => {
            if (first) {
                updateConfigData(line)
                first = false
            }
            else{
                storage.writeFormattedData()
            }
        });

        rl.on('close', () => {
            return null
        });
    }
}

function formatLine(){

}
function updateConfigData(csvLine) {
    let config = {
        "id": ['INT PRIMARY KEY AUTO_INCREMENT', 0],
    }
    const items = csvLine.split(',')
    for (const item of items) {
        if (item === 'UTCTIME') {
            config[item] = ['DATETIME']
        } else {
            config[item] = ['DOUBLE DEFAULT NULL']
        }
    }
    Config.columns = config
}

const data2 = {
    time: 305.66,
    flightMode: 1,
    statIgniter1: 0.5,
    statIgniter2: 0.6,
    statIgniter3: 0.7,
    statIgniter4: 0.8,
    statAccelerometer: 0.9,
    statBarometer: 1.0,
    statGPS: 1.1,
    statSD: 1.2,
    temperature: 22.5,
    altitude: 1500.5,
    altitude_ft: 4921.3,
    speed: 80.5,
    acceleration: 2.3,
    gps_fix: 1,
    latitude: 37.7749,
    longitude: -122.4194,
    pitch: 5.5,
    yaw: 2.1,
    roll: 0.5,
    batt1_mV: 3800,
    batt2_mV: 3800,
    batt3_mV: 3810,
};

initiateTestDB()
// const data1 = new MyData();
//
// fs.readFile('../../DATA/2024-08-19_005016_raw.txt', (err, data) => {
//     if (err) {
//         console.error("Error reading file:", err);
//         return;
//     }
//     data1.handleRawMockData(data);
// });
//console.log(storage.getLastInput())
