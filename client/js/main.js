// Main page object ===================================
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

// Components =========================================
const altComponent = new Altitude();
page.components.push(altComponent);

const mapComponent = new MyMap();
page.components.push(mapComponent);

// WebSocket ===========================================
function createSocket() {
    const socket = new WebSocket('ws://localhost:8000');

    socket.addEventListener('open', (event) => {
        socket.send('OK');
    });

    socket.addEventListener('message', (event) => {
        data = JSON.parse(event.data)
        page.update_all(data);
        socket.send('OK');
    });
};

createSocket();