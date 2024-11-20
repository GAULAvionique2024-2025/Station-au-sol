import Database from 'better-sqlite3';

/**
 * The MyStorage class regroup function used to manipulate the data about flights stored in the database.db file.
 * It can alo be used to store new data in the same database.
 */
export default class MyStorage {

    /**
     * Constructor of the MyStorage class. Initialise a new table in the db. The data of this flight will be stored in this table.
     */
    constructor() {
        const databasePath = '../../DATA/database.db'

        this.db = new Database(databasePath);
        this.tableName = this.findNextTableName();
        this.createTableColumn();
    }

    /**
     * Finds the next available table name in the database.
     * This function checks the existing table names in the SQLite database and
     * increments the suffix (e.g., 'fly1', 'fly2', ...) until it finds a name
     * that does not already exist.
     *
     * @returns {string} - The name of the next available table (e.g., 'fly1', 'fly2', ...).
     */
    findNextTableName() {
        let cmp = 1;
        while (true) {
            const stmt = this.db.prepare(`SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'fly${cmp}'`);
            const table = stmt.all();
            if (table.length === 0) {
                break;
            }
            cmp += 1;
        }
        return `fly${cmp}`;
    }

    /**
     * Inserts a new row of formatted data into the database table.
     *
     * This function prepares an SQL `INSERT INTO` statement for the table defined by `this.tableName`
     * and inserts the values from the `data` object into the respective columns.
     *
     * The function assumes the `data` object has the following properties:
     * - `time`, `flightMode`
     * - `statIgniter1`, `statIgniter2`, `statIgniter3`, `statIgniter4`
     * - `statAccelerometer`, `statBarometer`, `statGPS`, `statSD`
     * - `temperature`, `altitude`, `altitude_ft`, `speed`, `acceleration`, `gps_fix`, `latitude`, `longitude`, `pitch`, `yaw`, `roll`
     * - `batt1_mV`, `batt2_mV`, `batt3_mV`
     *
     * If any of these fields are missing from the `data` object, they will be inserted as `NULL` in the table.
     *
     * @param {Object} data The data to be inserted into the table. It must contain the following properties:
     * @returns {void} This function does not return a value. It directly performs the insertion into the database.
     *
     * @example
     * const data = {
     *     time : 305.66
     *     flightMode: 1,
     *     statIgniter1: 0.5,
     *     statIgniter2: 0.6,
     *     statIgniter3: 0.7,
     *     statIgniter4: 0.8,
     *     statAccelerometer: 0.9,
     *     statBarometer: 1.0,
     *     statGPS: 1.1,
     *     statSD: 1.2,
     *     temperature: 22.5,
     *     altitude: 1500.5,
     *     altitude_ft: 4921.3,
     *     speed: 80.5,
     *     acceleration: 2.3,
     *     gps_fix: 1,
     *     latitude: 37.7749,
     *     longitude: -122.4194,
     *     pitch: 5.5,
     *     yaw: 2.1,
     *     roll: 0.5,
     *     batt1_mV: 3800,
     *     batt2_mV: 3805,
     *     batt3_mV: 3810
     * };
     * myStorage.writeFormattedData(data);
     */

    writeFormattedData(data) {
        if (!data) {
            return;
        }
        const stmt = this.db.prepare(`
        INSERT INTO ${this.tableName} (
            time, flightMode, statIgniter1, statIgniter2, statIgniter3, statIgniter4,
            statAccelerometer, statBarometer, statGPS, statSD, temperature, altitude,
            altitude_ft, speed, acceleration, gps_fix, latitude, longitude, pitch,
            yaw, roll, batt1_mV, batt2_mV, batt3_mV
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )`);

        stmt.run(data.time, data.flightMode, data.statIgniter1, data.statIgniter2, data.statIgniter3, data.statIgniter4, data.statAccelerometer, data.statBarometer, data.statGPS, data.statSD, data.temperature, data.altitude, data.altitude_ft, data.speed, data.acceleration, data.gps_fix, data.latitude, data.longitude, data.pitch, data.yaw, data.roll, data.batt1_mV, data.batt2_mV, data.batt3_mV);
    }

    /**
     * Creates a new table in the database with predefined columns if it does not already exist.
     * The table name is dynamically inserted from the `name` parameter, and it will contain
     * multiple columns for storing flight data such as GPS coordinates, temperature, altitude,
     * and battery levels, among others.
     *
     * @throws {Error} Will throw an error if the SQL statement fails to execute.
     */
    createTableColumn() {
        this.db.prepare(`CREATE TABLE IF NOT EXISTS ${this.tableName} (
            id                  INTEGER PRIMARY KEY AUTOINCREMENT,
            date                TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            time                DOUBLE DEFAULT NULL, 
            flightMode          INTEGER DEFAULT NULL, 
            statIgniter1        DOUBLE DEFAULT NULL, 
            statIgniter2        DOUBLE DEFAULT NULL, 
            statIgniter3        DOUBLE DEFAULT NULL, 
            statIgniter4        DOUBLE DEFAULT NULL, 
            statAccelerometer   DOUBLE DEFAULT NULL, 
            statBarometer       DOUBLE DEFAULT NULL, 
            statGPS             DOUBLE DEFAULT NULL, 
            statSD              DOUBLE DEFAULT NULL, 
            temperature         DOUBLE DEFAULT NULL, 
            altitude            DOUBLE DEFAULT NULL, 
            altitude_ft         DOUBLE DEFAULT NULL, 
            speed               DOUBLE DEFAULT NULL, 
            acceleration        DOUBLE DEFAULT NULL, 
            gps_fix             DOUBLE DEFAULT NULL,
            latitude            DOUBLE DEFAULT NULL, 
            longitude           DOUBLE DEFAULT NULL, 
            pitch               DOUBLE DEFAULT NULL, 
            yaw                 DOUBLE DEFAULT NULL, 
            roll                DOUBLE DEFAULT NULL, 
            batt1_mV            DOUBLE DEFAULT NULL, 
            batt2_mV            DOUBLE DEFAULT NULL, 
            batt3_mV            DOUBLE DEFAULT NULL
        )`).run();
    }
}
