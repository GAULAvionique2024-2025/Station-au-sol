// Main page object =======================================
const page = {
    nombreMaxDeDonnees: 200,
    paused: false,
    components: {},
    update_all: function (data) {
        if (this.paused) {
            return;
        }

        for (const [key, component] of Object.entries(this.components)) {
            component.update(data);
        }
    },
    reset_all: function () {
        page.components["console"].log("Reset");

        for (const [key, component] of Object.entries(this.components)) {
            component.reset();
        }
    },
};

// Components =============================================
window.onload = () => {
    const altSpeedAccComponent = new AltitudeSpeedAcceleration();
    page.components["altSpeedAccComponent"] = altSpeedAccComponent;

    const mapComponent = new MyMap();
    page.components["mapComponent"] = mapComponent;

    const checksComponent = new Checks();
    page.components["checksComponent"] = checksComponent;

    const IMUComponent = new IMU();
    page.components["IMUComponent"] = IMUComponent;

    const tempVibrLandComponent = new TempVibrLand();
    page.components["tempVibrLandComponent"] = tempVibrLandComponent;

    const console = new Console();
    page.components["console"] = console;

    initSocket();
}

// PauseBtn ===============================================
const pauseBtnElems = document.getElementsByClassName("btn-pause");

function togglePause() {
    page.paused = !page.paused;
    if (page.paused) {
        for (pauseBtnElem of pauseBtnElems) {
            pauseBtnElem.classList.remove("btn-danger");
            pauseBtnElem.classList.add("btn-success");
            pauseBtnElem.textContent = "Resume";
        }
        page.components["console"].log("Paused");
    } else {
        for (pauseBtnElem of pauseBtnElems) {
            pauseBtnElem.classList.remove("btn-success");
            pauseBtnElem.classList.add("btn-danger");
            pauseBtnElem.textContent = "Pause";
        }
        page.components["console"].log("Resumed");
    }
}

// WebSocket ==============================================
function initSocket() {
    page.socket = io();

    page.socket.on('data', (data) => {
        handleData(data, (data) => {
            page.update_all(data);
        })
    });

    page.socket.on("connect", () => {
        page.components["console"].log("Socket connected", "green");
        console.log("Socket Connected");
    });

    page.socket.on("disconnect", () => {
        page.components["console"].log("Socket lost connection (the web app lost connection with the local server)", "red");
        console.log("Socket Disconnected");
    });
}

function handleData(data, callback) {
    // Keep 1 decimal
    data.altitude = Number(data.altitude).toFixed(1);
    data.speed = Number(data.speed).toFixed(1);
    data.acceleration = Number(data.acceleration).toFixed(1);
    data.pitch = Number(data.pitch).toFixed(1);
    data.yaw = Number(data.yaw).toFixed(1);
    data.roll = Number(data.roll).toFixed(1);
    callback(data)
}