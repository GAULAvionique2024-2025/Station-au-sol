// Main page object ===================================
const page = {
    components: [],
    update_all: function (data) {
        this.components.forEach(component => {
            component.update(data);
        });
    },
};

// Components =========================================
const altComponent = new Altitude();
page.components.push(altComponent);

// WebSocket ===========================================
function createSocket() {
    const socket = new WebSocket('ws://localhost:8000');

    socket.addEventListener('open', (event) => {
        socket.send('OK');
    });

    socket.addEventListener('message', (event) => {
        console.log(event.data);
        page.update_all(event.data);
        socket.send('OK');
    });
};