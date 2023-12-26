const nombreMaxDeDonnees = 1000;

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
const altComponent = new Altitude();
page.components.push(altComponent);

const mapComponent = new MyMap();
page.components.push(mapComponent);

const checksComponent = new Checks();
page.components.push(checksComponent);

const IMUComponent = new IMU();
page.components.push(IMUComponent);

const speedAccComponent = new SpeedAcceleration();
page.components.push(speedAccComponent);

const tempVibrLandComponent = new TempVibrLand();
page.components.push(tempVibrLandComponent);

// WebSocket ==============================================
const socket = io();

socket.on('data', (data) => {
    // console.log(data)
    page.update_all(data);
});