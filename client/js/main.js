let nombreMaxDeDonnees = 1000;

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

const IMUComponent = new IMU();
page.components.push(IMUComponent);

// WebSocket ==============================================
const socket = io();

socket.on('data', (data) => {
    console.log(data)
    page.update_all(data);
});