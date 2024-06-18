import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import moment from 'moment';
import chalk from 'chalk';
import logger from './utils/logger.mjs';

export default class MyStorage {
    constructor() {
        // To get the path of the folder containing this file
        this.__dirname = dirname(fileURLToPath(import.meta.url));


        this.LOGS_FOLDER_PATH = join(this.__dirname, "../logs")
        fs.mkdirSync(this.LOGS_FOLDER_PATH, { recursive: true });

        this.DIST_FOLDER_PATH = join(this.__dirname, "../dist")
        fs.mkdirSync(this.DIST_FOLDER_PATH, { recursive: true });


        const date = moment().format("YYYY-MM-DD_HHmmss")

        this.RAW_LOG_PATH = join(this.LOGS_FOLDER_PATH, `${date}_raw.txt`);
        logger(chalk.blue("Raw log file at"), this.RAW_LOG_PATH);

        this.FORMATTED_LOG_PATH = join(this.LOGS_FOLDER_PATH, `${date}_formatted.csv`);
        logger(chalk.blue("CSV log file at"), this.FORMATTED_LOG_PATH);


        // Logs for the client
        this.DIST_LOG_PATH = join(this.DIST_FOLDER_PATH, "logs.txt");
        fs.writeFileSync(this.DIST_LOG_PATH, "");
    }

    writeRaw(data) {
        if (!data) {
            return;
        }

        fs.mkdirSync(this.LOGS_FOLDER_PATH, { recursive: true }); // Make sure the folder exists
        fs.appendFile(this.RAW_LOG_PATH, data, (err) => {
            if (err) throw err;
        });

        fs.mkdirSync(this.DIST_FOLDER_PATH, { recursive: true }); // Make sure the folder exists
        fs.appendFile(this.DIST_LOG_PATH, data, (err) => {
            if (err) throw err;
        });
    }

    writeFormatted(data) {
        if (!data) {
            return;
        }


        fs.mkdirSync(this.LOGS_FOLDER_PATH, { recursive: true }); // Make sure the folder exists

        // Create the csv file if it doesn't exist
        if (!fs.existsSync(this.FORMATTED_LOG_PATH)) {
            // CSV header
            fs.writeFile(this.FORMATTED_LOG_PATH, Object.keys(data).join(", ") + "\n", (err) => {
                if (err) throw err;
            });
        }

        fs.appendFile(this.FORMATTED_LOG_PATH, Object.values(data).join(", ") + "\n", (err) => {
            if (err) throw err;
        });
    }
}