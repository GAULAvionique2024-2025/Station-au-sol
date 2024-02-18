/**
 * Status component (display battery, gps, igniter, connection status of the rocket)
 * @module Status
 */

export default class Status {
    constructor({
        'battId': battId = "batt",
        'gpsId': gpsId = "gps",
        'ignitId': ignitId = "ignit",
        'connId': connId = "conn",
        'maxConnInterval': maxConnInterval = 10,
    } = {}) {
        this.batt = document.getElementById(battId);
        this.gps = document.getElementById(gpsId);
        this.ignit = document.getElementById(ignitId);
        this.conn = document.getElementById(connId);

        this.maxConnInterval = maxConnInterval;

        this.timer = 0;
        this.timerInterval = setInterval(() => {
            this.updatetimer(1);
        }, 1000);
    }

    updateSrc(src, newSvg) {
        return src.slice(0, src.lastIndexOf("/") + 1) + newSvg;
    }

    updateBatt(data) {
        if (data.batt_check == "1") {
            this.batt.src = this.updateSrc(this.batt.src, "batt-good.svg");
        } else {
            this.batt.src = this.updateSrc(this.batt.src, "batt-bad.svg");
        }
    }

    updateIgnit(data) {
        if (data.igniter_check == "1") {
            this.ignit.src = this.updateSrc(this.ignit.src, "ignit-good.svg");
        } else {
            this.ignit.src = this.updateSrc(this.ignit.src, "ignit-bad.svg");
        }
    }

    updateGPS(data) {
        if (data.gps_check == "1") {
            this.gps.src = this.updateSrc(this.gps.src, "gps-good.svg");
        } else {
            this.gps.src = this.updateSrc(this.gps.src, "gps-bad.svg");
        }
    }

    // Timer for connection status (Will probably be moved to backend, and will send "1" if the connection is good)
    // Called every second
    updatetimer(seconds) {
        this.timer += seconds;
        this.updateConn();
    }

    resetTimer() {
        // Reset interval
        clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            this.updatetimer(1);
        }, 1000);

        // Set timer to 0s
        this.timer = 0;
    }

    updateConn(data = undefined) {
        if (data) {
            // Data received, good
            this.resetTimer();
            this.conn.src = this.updateSrc(this.conn.src, "conn-good.svg");
        } else if (this.timer > this.maxConnInterval) {
            // No data received for the max interval, bad
            this.conn.src = this.updateSrc(this.conn.src, "conn-bad.svg");
        } else if (this.timer > this.maxConnInterval / 2) {
            // No data received for half the max interval, mid
            this.conn.src = this.updateSrc(this.conn.src, "conn-mid.svg");
        }
    }

    update(data) {
        this.updateBatt(data);
        this.updateIgnit(data);
        this.updateGPS(data);
        this.updateConn(data);
    }

    setConfig(config) {

    }

    reset() {
        this.batt.src = this.updateSrc(this.batt.src, "batt-mid.svg");
        this.ignit.src = this.updateSrc(this.ignit.src, "ignit-mid.svg");
        this.gps.src = this.updateSrc(this.gps.src, "gps-mid.svg");
    }
}