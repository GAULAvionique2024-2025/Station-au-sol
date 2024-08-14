import { SerialPort } from "serialport";

const serialPort = new SerialPort({ path: "COM3", baudRate: 9600 });

serialPort.on("data", (data) => {
    console.log(data);
});
