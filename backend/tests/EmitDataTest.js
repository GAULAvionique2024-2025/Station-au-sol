import MyStorage from "../src/storage.mjs";
import fs from "fs";
import readline from 'readline'
import Config from "../src/utils/config.js";
import EventEmitter from "node:events";

export default class Test extends EventEmitter {
    /**
     * Creates the "Test_db" table using an existing CSV data file,
     * if the table does not already exist. This ensures that "Test_db"
     * is accessible for sending data to the frontend.
     */
    static initiateTestDB() {
        const b = MyStorage.doesTableExists("Test_DB")
        let storage;
        if (!b) {
            let first = true
            const rl = readline.createInterface({
                input: fs.createReadStream('../../DATA/Old_data_for_testing_purpose.csv'),
                output: process.stdout,
                terminal: false
            });

            rl.on('line', (line) => {
                if (first) {
                    Test.updateConfigData(line)
                    first = false
                    storage = new MyStorage("Test_DB");
                } else {
                    storage.writeFormattedData(Test.formatLine(line))
                }
            });

            rl.on('close', () => {
                return null
            });
        }
    }

    /**
     * Converts a CSV-formatted line into a JSON object compatible with the database.
     * Uses the `Config.columns` attribute to map CSV values to JSON keys.
     *
     * @param {string} csvLine - A single line of CSV data to be transformed.
     * @returns {Object} A JSON object formatted according to the database schema.
     */
    static formatLine(csvLine) {
        const data = csvLine.split(",")
        data.reverse()
        let jsonData = {}
        for (let i in Config.columns) {
            jsonData[i] = data.pop()
        }
        return jsonData
    }

    /**
     * Ensures that `Config.columns` is compatible with the data in the CSV file
     * by parsing the first line (header row). It also performs basic cleaning
     * to make attribute names compatible with the database.
     *
     * @param {string} csvLine - The first line of the CSV file containing attribute names.
     */
    static updateConfigData(csvLine) {
        let config = {}
        const items = csvLine.split(',')
        for (let item of items) {
            item = item.replace(' ', '_').replace('(', '').replace(')', '')
            if (item === 'UTCTIME') {
                config[item] = ['DATETIME']
            } else {
                config[item] = ['DOUBLE DEFAULT NULL']
            }
        }
        Config.columns = config
    }

    /**
     * Sends a "data" signal with a line of data every second
     * until the Test_DB database is empty.
     */
    async sendDataEachSecond() {
        let cmp = 1;
        let escape = true;
        while (escape) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
            const result = MyStorage.getSpecificInput("Test_DB", cmp);
            console.log(result);
            escape = (result !== null);
            if (escape) {
                cmp++;
                this.emit("data", result);
            }
        }
    }

    /**
     * Orchestrates the sequence of function calls required for proper testing.
     * It initializes the test database and starts sending data at regular intervals.
     */
    async start() {
        Test.initiateTestDB()
        await this.sendDataEachSecond()
    }
}

const test = new Test();
test.start()
