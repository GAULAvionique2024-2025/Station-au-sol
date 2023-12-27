const nombreMaxDeDonnees = 200;

// Main page object =======================================
const page = {
    components: [],
    update_all: function (data) {
        this.components.forEach(component => {
            component.update(data);
        });
    },
    reset_all: function () {
        this.components.forEach(component => {
            component.reset();
        });
    },
};

// Components =============================================
window.onload = () => {
    const altSpeedAccComponent = new AltitudeSpeedAcceleration();
    page.components.push(altSpeedAccComponent);

    const mapComponent = new MyMap();
    page.components.push(mapComponent);

    const checksComponent = new Checks();
    page.components.push(checksComponent);

    const IMUComponent = new IMU();
    page.components.push(IMUComponent);

    const tempVibrLandComponent = new TempVibrLand();
    page.components.push(tempVibrLandComponent);
}

// WebSocket ==============================================
const socket = io();

socket.on('data', (data) => {
    // console.log(data);
    handleData(data, (data) => {
        page.update_all(data);
    })
});


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