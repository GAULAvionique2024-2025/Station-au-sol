import { SerialPort } from "serialport";
import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';


// SERVEUR WEB ================================================================

// Application express
const app = express();
// Serveur HTTP de l'application express
const server = createServer(app);
// Lier socket.io au serveur HTTP de l'application express
const io = new Server(server);

// Pour obtenir le chemin du dossier contenant ce fichier
const __dirname = dirname(fileURLToPath(import.meta.url));

// Fourni les fichiers statiques du dossier client
app.use(express.static(join(__dirname, '..', 'client')));

// Pour que le serveur HTTP de l'application écoute les connexions des clients
// (80 = port par défault pour HTTP)
server.listen(80, () => {
    console.log('Listening on port 80');
});


// COMMUNICATION SERIAL =======================================================

// "/dev/ttyS0" pour raspberry pi
// const port = new SerialPort({ path: "/dev/ttyS0", baudRate: 115200 });
const port = new SerialPort({ path: "COM3", baudRate: 115200 }, (err) => {
    // Erreur lors de l'ouverture de la communication
    if (err) { console.log(err.message) }
});

// Passe les données à la fonction handleSerialData
port.on("data", handleSerialData);

// Extrais une ligne de données (qui finit par \n)
let serialTextBuffer = "";
function handleSerialData(dataBuffer) {
    // Ajoute les données au buffer de texte
    serialTextBuffer += dataBuffer.toString('utf-8');
    if (serialTextBuffer.includes("\n")) {
        // Garde le texte avant "\n" pour le traiter par la suite
        let line = serialTextBuffer.split("\n")[0];
        // Enlève le texte avant "\n" pour ne pas le traiter en double
        serialTextBuffer = serialTextBuffer.split("\n")[1];
        handleData(line);
    }
}

// Formatte les données, puis les envois aux clients connectés au serveur
function handleData(dataStr) {
    const dataList = dataStr.trim().split(",")

    // Skip les données incomplètes
    if (dataList.length != 15) {
        return
    }

    const dataDict = {
        "time": dataList[0],
        "altitude": dataList[1],
        "pitch": dataList[2],
        "roll": dataList[3],
        "yaw": dataList[4],
        "lat": dataList[5],
        "lon": dataList[6],
        "speed": dataList[7],
        "acceleration": dataList[8],
        "temperature": dataList[9],
        "vibrations": dataList[10],
        "landing_force": dataList[11],
        "batt_check": dataList[12],
        "igniter_check": dataList[13],
        "gps_check": dataList[14],
    }

    io.emit('data', dataDict);
}