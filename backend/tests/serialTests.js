import { SerialPort } from "serialport";
import { appendFileSync } from "fs";

const serialPort = new SerialPort({ path: "COM3", baudRate: 9600 });

console.log("Serial port opened");

serialPort.on("data", (data) => {
    console.log(data);
    appendFileSync("data.txt", data);
});
