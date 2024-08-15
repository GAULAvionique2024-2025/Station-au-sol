import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import moment from "moment";
import chalk from "chalk";
import logger from "./utils/logger.mjs";

export default class MyStorage {
    constructor() {
        // To get the path of the folder containing this file
        this.__dirname = dirname(fileURLToPath(import.meta.url));

        const date = moment().format("YYYY-MM-DD_HHmmss");

        // Logs for the server
        this.LOGS_FOLDER_PATH = join(this.__dirname, "../logs");
        fs.mkdirSync(this.LOGS_FOLDER_PATH, { recursive: true }); // Make sure the folder exists

        this.RAW_LOG_PATH = join(this.LOGS_FOLDER_PATH, `${date}_raw.txt`);
        logger(chalk.blue("Raw log file at"), this.RAW_LOG_PATH);

        this.FORMATTED_LOG_PATH = join(this.LOGS_FOLDER_PATH, `${date}_formatted.csv`);
        logger(chalk.blue("CSV log file at"), this.FORMATTED_LOG_PATH);

        // Logs for the client
        this.DIST_FOLDER_PATH = join(this.__dirname, "../dist");
        fs.mkdirSync(this.DIST_FOLDER_PATH, { recursive: true }); // Make sure the folder exists

        this.DIST_LOG_PATH = join(this.DIST_FOLDER_PATH, "log.txt");
        if (fs.existsSync(this.DIST_LOG_PATH)) fs.unlinkSync(this.DIST_LOG_PATH); // Delete the file if it exists

        this.DIST_LOGF_PATH = join(this.DIST_FOLDER_PATH, "logf.txt"); // Log formatted
        if (fs.existsSync(this.DIST_LOGF_PATH)) fs.unlinkSync(this.DIST_LOGF_PATH); // Delete the file if it exists
    }

    writeRaw(data) {
        if (!data) {
            return;
        }

        // Write to the server raw log file
        fs.mkdirSync(this.LOGS_FOLDER_PATH, { recursive: true }); // Make sure the folder exists
        fs.appendFile(this.RAW_LOG_PATH, data, (err) => {
            if (err) throw err;
        });

        // Write to the client raw log file
        fs.mkdirSync(this.DIST_FOLDER_PATH, { recursive: true }); // Make sure the folder exists
        fs.appendFile(this.DIST_LOG_PATH, data, (err) => {
            if (err) throw err;
        });
    }

    writeFormatted(data) {
        if (!data) {
            return;
        }

        // Write to the server formatted log file
        fs.mkdirSync(this.LOGS_FOLDER_PATH, { recursive: true }); // Make sure the folder exists

        // Create the csv file and header if it doesn't exist
        if (!fs.existsSync(this.FORMATTED_LOG_PATH)) {
            fs.writeFile(this.FORMATTED_LOG_PATH, Object.keys(data).join(", ") + "\n", (err) => {
                if (err) throw err;
            });
        }

        fs.appendFile(this.FORMATTED_LOG_PATH, Object.values(data).join(", ") + "\n", (err) => {
            if (err) throw err;
        });

        // Write to the client formatted log file
        fs.mkdirSync(this.DIST_FOLDER_PATH, { recursive: true }); // Make sure the folder exists

        let dataArr = [];

        for (const key in data) {
            dataArr.push([key, data[key]]);
        }

        // console.log(dataArr);

        dataArr.sort((a, b) => a);

        // Keys
        fs.appendFile(this.DIST_LOGF_PATH, Object.keys(data).join(", ") + "\n", (err) => {
            if (err) throw err;
        });
        // Values
        fs.appendFile(this.DIST_LOGF_PATH, Object.values(data).join(", ") + "\n", (err) => {
            if (err) throw err;
        });
    }
}
