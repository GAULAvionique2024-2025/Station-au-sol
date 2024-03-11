import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import moment from 'moment';

export default class MyStorage {
    constructor() {
        this.LOG_FOLDER_PATH = "../logs"
        this.DIST_FOLDER_PATH = "../dist"

        // To get the path of the folder containing this file
        this.__dirname = dirname(fileURLToPath(import.meta.url));

        const date = moment().format("YYYY-MM-DD_HHmmss")

        this.rawPath = join(this.__dirname, this.LOG_FOLDER_PATH, `${date}_raw.txt`);
        this.formattedPath = join(this.__dirname, this.LOG_FOLDER_PATH, `${date}_formatted.csv`);

        // Create the logs folder if it doesn't exist
        if (!fs.existsSync(join(this.__dirname, this.LOG_FOLDER_PATH))) {
            fs.mkdirSync(join(this.__dirname, this.LOG_FOLDER_PATH));
        }

        // Logs accessible from the client
        this.distLogsPath = join(this.__dirname, this.DIST_FOLDER_PATH, "logs.txt");
        fs.writeFileSync(this.distLogsPath, "");
    }

    writeRaw(data) {
        fs.appendFile(this.rawPath, data, (err) => {
            if (err) throw err;
        });

        fs.appendFile(this.distLogsPath, data, (err) => {
            if (err) throw err;
        });
    }

    writeFormatted(data) {
        // Create the csv file if it doesn't exist
        if (!fs.existsSync(this.formattedPath)) {
            // CSV header
            fs.writeFile(this.formattedPath, Object.keys(data).join(", ") + "\n", (err) => {
                if (err) throw err;
            });
        }

        fs.appendFile(this.formattedPath, Object.values(data).join(", ") + "\n", (err) => {
            if (err) throw err;
        });
    }
}