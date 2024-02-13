import Map from "./components/map.js";
import MyChart from "./components/chart.js";
import Status from "./components/status.js";
import Angle from "./components/angle.js";
import Other from "./components/other.js";
import Console from "./components/console.js";
import UI from "./ui.js";

const components = {
    'Map': new Map(),
    'Chart': new MyChart({
        'maxData': 600,
    }),
    'Angle': new Angle(),
    'Console': new Console(),
}

const ui = new UI({
    'components': components,
});

function update_all(components, data) {
    for (const component of components) {
        component.update(data);
    }
}


// WebSocket ==============================================
function initSocket() {
    const socket = io();

    socket.on('data', (data) => {
        handleData(data, (data) => {
            update_all(data);
        })
    });

    socket.on("connect", () => {
        console.log("Socket Connected");
    });

    socket.on("disconnect", () => {
        console.log("Socket Disconnected");
    });
}

initSocket();

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