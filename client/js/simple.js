// DOM Manipulation =======================================
const coordsElem = document.getElementById("map-coords");
const altElem = document.getElementById("alt-value");
const speedElem = document.getElementById("speed-value");
const accElem = document.getElementById("acc-value");
const battElem = document.getElementById("batt-state");
const gpsElem = document.getElementById("gps-state");
const igniElem = document.getElementById("igni-state");
const connElem = document.getElementById("conn-value");
let timerInterval = setInterval(() => {
    timer += 1;
    connElem.textContent = timer + " s";
}, 1000);
let timer = 0;
const pitchElem = document.getElementById("pitch-value");
const yawElem = document.getElementById("yaw-value");
const rollElem = document.getElementById("roll-value");
const tempAmbElem = document.getElementById("temp-amb-value");
const tempElem = document.getElementById("temp-value");
const vibrElem = document.getElementById("vibr-value");
const landElem = document.getElementById("land-value");

function update_all(data) {
    if (paused) {
        return;
    }
    // Coordinates
    coordsElem.textContent = `${data.lat}, ${data.lon}`;
    // Altitude
    altElem.textContent = data.altitude + " m";
    // Speed
    speedElem.textContent = data.speed + " m/s";
    // Acceleration
    accElem.textContent = data.acceleration + " m/s²";
    // Battery check
    if (data.batt_check == "1") {
        battElem.textContent = "OK";
        battElem.classList.add("text-success");
        battElem.classList.remove("text-danger");
    } else {
        battElem.textContent = "ERROR";
        battElem.classList.add("text-danger");
        battElem.classList.remove("text-success");
    }
    // Igniter check
    if (data.igniter_check == "1") {
        igniElem.textContent = "(8/8) OK";
        igniElem.classList.add("text-success");
        igniElem.classList.remove("text-danger");
    } else {
        igniElem.textContent = "ERROR";
        igniElem.classList.add("text-danger");
        igniElem.classList.remove("text-success");
    }
    // GPS check
    if (data.gps_check == "1") {
        gpsElem.textContent = "OK";
        gpsElem.classList.add("text-success");
        gpsElem.classList.remove("text-danger");
    } else {
        gpsElem.textContent = "ERROR";
        gpsElem.classList.add("text-danger");
        gpsElem.classList.remove("text-success");
    }
    // Connection
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timer += 1;
        connElem.textContent = timer + " s";
    }, 1000)
    timer = 0;
    connElem.textContent = timer + " s";
    // Pitch
    pitchElem.textContent = data.pitch + "°";
    // Yaw
    yawElem.textContent = data.yaw + "°";
    // Roll
    rollElem.textContent = data.roll + "°";
    // Temperature
    tempElem.textContent = data.temperature + " °C";
    // Vibration
    vibrElem.textContent = data.vibrations + " Hz";
    // Landing Force
    landElem.textContent = data.landing_force + " m/s²";
}

function reset_all() {
    // Coordinates
    coordsElem.textContent = "0.0000, 0.0000";
    // Altitude
    altElem.textContent = "0.0 m";
    // Speed
    speedElem.textContent = "0.0 m/s";
    // Acceleration
    accElem.textContent = "0.0 m/s²";
    // Battery check
    battElem.textContent = "ERROR";
    battElem.classList.add("text-danger");
    battElem.classList.remove("text-success");
    // Igniter check
    igniElem.textContent = "ERROR";
    igniElem.classList.add("text-danger");
    igniElem.classList.remove("text-success");
    // GPS check
    gpsElem.textContent = "ERROR";
    gpsElem.classList.add("text-danger");
    gpsElem.classList.remove("text-success");
    // Pitch
    pitchElem.textContent = "0°";
    // Yaw
    yawElem.textContent = "0°";
    // Roll
    rollElem.textContent = "0°";
    // Temperature
    tempElem.textContent = "0 °C";
    // Vibration
    vibrElem.textContent = "0 Hz";
    // Landing Force
    landElem.textContent = "0 m/s²";
    // Log Reset
    log("Reset")
}


// WebSocket ==============================================
const socket = io();

socket.on('data', (data) => {
    handleData(data, (data) => {
        update_all(data);
    })
});

socket.on("connect", () => {
    log("Socket connected", "green");
    console.log("Socket Connected");
});

socket.on("disconnect", () => {
    log("Socket lost connection", "red");
    console.log("Socket Disconnected");
});


function handleData(data, callback) {
    // Keep 1 decimal
    data.altitude = Number(data.altitude).toFixed(1);
    data.speed = Number(data.speed).toFixed(1);
    data.acceleration = Number(data.acceleration).toFixed(1);
    data.pitch = Number(data.pitch).toFixed(1);
    data.yaw = Number(data.yaw).toFixed(1);
    data.roll = Number(data.roll).toFixed(1);
    callback(data);
}


// Console ================================================
const consoleElem = document.getElementById("console-text");
const startTime = Date.now();
log("Started")

function log(text, color = "") {
    const textElem = document.createElement("p");

    const time = (Date.now() - startTime) / 1000;
    textElem.textContent = `[${time}] ${text}`;

    if (color == "green") {
        textElem.classList.add("text-success");
    } else if (color == "red") {
        textElem.classList.add("text-danger");
    }

    consoleElem.appendChild(textElem);
    consoleElem.scrollTo(0, consoleElem.scrollHeight);
}


// Other ==================================================
const pauseBtnElem = document.getElementById("pause-btn");
let paused = false;

function togglePause() {
    paused = !paused;
    if (paused) {
        pauseBtnElem.classList.remove("btn-danger");
        pauseBtnElem.classList.add("btn-success");
        pauseBtnElem.textContent = "Resume";
        log("Paused");
    } else {
        pauseBtnElem.classList.remove("btn-success");
        pauseBtnElem.classList.add("btn-danger");
        pauseBtnElem.textContent = "Pause";
        log("Resumed");
    }
}
