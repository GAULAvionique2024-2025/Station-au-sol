/**
 * Other component (display other data)
 * @module Other
 */

export default class Other {
    constructor({
        'ambTempId': ambTempId = "amb-temp",
        'engTempId': engTempId = "eng-temp",
        'vibrId': vibrId = "vibr",
        'landId': landId = "land",
    } = {}) {
        this.ambTemp = document.getElementById(ambTempId);
        this.engTemp = document.getElementById(engTempId);
        this.vibr = document.getElementById(vibrId);
        this.land = document.getElementById(landId);
    }

    update(data) {
        this.ambTemp.textContent = data.temperature;
        this.engTemp.textContent = data.temperature;
        this.vibr.textContent = data.vibrations;
        this.land.textContent = data.landing_force;
    }

    setConfig(config) {

    }

    reset() {
        this.ambTemp.textContent = "0";
        this.engTemp.textContent = "0";
        this.vibr.textContent = "0";
        this.land.textContent = "0";
    }
}