import MyWebServer from "./webserver.mjs";
import MyStorage from "./storage.mjs";
import MySocket from "./socket.mjs";
import MySerial from "./serial.mjs";

const SIMULATION = process.argv.includes("sim");

class App {
    constructor() {
        // Test server (uses csv instead of serial connection)
        if (SIMULATION) {
            this.webServer = new MyWebServer();
            this.socket = new MySocket(this.webServer.getHTTPServer());
        } else {
            this.webServer = new MyWebServer();
            this.storage = new MyStorage();
            this.socket = new MySocket(this.webServer.getHTTPServer());
            this.serial = new MySerial(this.socket, this.storage, {
                'path': "COM3",
                'reconnectSerialTimeout': 2000,
            });
        }
    }

    test() {
        this.serial.getSerialPaths().then((paths) => {
            console.log("Available paths", paths);
        });
    }
}

const app = new App();
// app.test();