import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import moment from 'moment';

export default class MyStorage {
    constructor() {
        // To get the path of the folder containing this file
        this.__dirname = dirname(fileURLToPath(import.meta.url));

        const date = moment().format("YYYY-MM-DD_HHmmss")

        this.rawPath = join(this.__dirname, `./logs/${date}_raw.txt`);
        this.formattedPath = join(this.__dirname, `./logs/${date}_formatted.csv`);

        // Create the logs folder if it doesn't exist
        if (!fs.existsSync(join(this.__dirname, './logs'))) {
            fs.mkdirSync(join(this.__dirname, './logs'));
        }
    }

    writeRaw(data) {
        fs.appendFile(this.rawPath, data, (err) => {
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