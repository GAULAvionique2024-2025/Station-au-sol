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
    } = {}) {
        this.batt = document.getElementById(battId);
        this.gps = document.getElementById(gpsId);
        this.ignit = document.getElementById(ignitId);
        this.conn = document.getElementById(connId);

        // this.timer = 0;
        // this.timerInterval = setInterval(() => {
        //     this.addSecond();
        // }, 1000);
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

    // addSecond() {
    //     this.timer += 1;
    //     this.connElem.textContent = this.timer + this.connUnits;
    // }

    // updateConn() {
    //     // Reset interval
    //     clearInterval(this.timerInterval);
    //     this.timerInterval = setInterval(() => {
    //         this.addSecond();
    //     }, 1000)

    //     // Set timer to 0 s
    //     this.timer = 0;
    //     this.connElem.textContent = this.timer + this.connUnits;
    // }

    updateSrc(src, newSvg) {
        return src.slice(0, src.lastIndexOf("/") + 1) + newSvg;
    }

    update(data) {
        this.updateBatt(data);
        this.updateIgnit(data);
        this.updateGPS(data);
        // this.updateConn();
    }

    setOptions(options) {

    }

    reset() {
        this.batt.src = this.updateSrc(this.batt.src, "batt-mid.svg");
        this.ignit.src = this.updateSrc(this.ignit.src, "ignit-mid.svg");
        this.gps.src = this.updateSrc(this.gps.src, "gps-mid.svg");
    }
}