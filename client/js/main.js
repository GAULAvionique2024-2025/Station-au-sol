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
    page.socket = new WebSocket('ws://localhost:8000');

    page.socket.addEventListener('open', (event) => {
        page.socket.send('OK');
    });

    page.socket.addEventListener('message', (event) => {
        data = JSON.parse(event.data)
        page.update_all(data);
        page.socket.send('OK');
    });
};

function removeSocket() {
    page.socket.close();
}

createSocket();