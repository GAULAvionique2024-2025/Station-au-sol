import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { SerialPortMock } from 'serialport'
import chalk from 'chalk';
import logger from './logger.mjs';

let serialport;
let mockData;
let i = 0;

export function startSerialMock() {
    mockData = readMockData();

    SerialPortMock.binding.createPort("testingPort");
    serialport = new SerialPortMock({ path: "testingPort", baudRate: 115200 });

    serialport.on('open', () => {
        logger(chalk.blue("Mock serial port"), chalk.green("opened"), `on ${chalk.yellow("'testingPort'")} at ${chalk.yellow("115200")}`);
        sendMockData();
    });

    return serialport;
}

function readMockData() {
    // To get the path of the folder containing this file
    const __dirname = dirname(fileURLToPath(import.meta.url));

    return fs.readFileSync(join(__dirname, 'serialmockData.csv'), { encoding: 'utf-8' })
        .split('\n').filter((line) => !line.startsWith('#') && !line.startsWith('Temps'));
}

function sendMockData() {
    if (!serialport.isOpen) {
        return;
    }

    const { data, deltaTime } = getMockData();
    serialport.port.emitData(Buffer.from(data + '\n', 'utf-8'));
    setTimeout(sendMockData, deltaTime);
}

function getMockData() {
    const data = mockData[i];
    i = (i + 1) % mockData.length;
    const deltaTime = (Number(mockData[i].split(',')[0]) - Number(data.split(',')[0])) * 1000;
    return { data, deltaTime };
}