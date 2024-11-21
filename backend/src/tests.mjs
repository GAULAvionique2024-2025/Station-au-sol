import MyStorage from "./storage.mjs";

//const storage = new MyStorage();

const data = {
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
    batt2_mV: 3805,
    batt3_mV: 3810
};
const t = MyStorage.retrieveWholeTable('fly1')
console.log(t)