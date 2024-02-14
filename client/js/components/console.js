/**
 * Console component (display messages in the console)
 * @module Console
 */

export default class Console {
    constructor({
        'consoleId': consoleId = "console-text",
    } = {}) {
        this.consoleElem = document.getElementById(consoleId);
        this.startTime = Date.now();
        this.log("Started");
    }

    logger(text, color = "") {
        const textElem = document.createElement("p");

        const time = (Date.now() - this.startTime) / 1000;
        textElem.textContent = `[${time}] ${text}`;

        if (color == "green") {
            textElem.classList.add("text-success");
        } else if (color == "red") {
            textElem.classList.add("text-danger");
        }

        this.consoleElem.appendChild(textElem);
        this.consoleElem.scrollTo(0, this.consoleElem.scrollHeight);
    }

    log(text) {
        this.logger(text);
    }

    success(text) {
        this.logger(text, "green");
    }

    error(text) {
        this.logger(text, "red");
    }

    update(data) {

    }

    setConfig(config) {

    }

    reset() {

    }
}