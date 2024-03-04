/**
 * Console component (display messages in the console)
 * @module components/Console
 */

import ComponentClass from './componentClass.js';
import moment from 'moment/moment.js';

export default class Console extends ComponentClass {
    constructor({
        'consoleId': consoleId = "console-text",
    } = {}) {
        super();
        this.consoleElem = document.getElementById(consoleId);
        this.startTime = Date.now();
        this.log("Started");
    }

    logger(text, color = "", html = false) {
        const textElem = document.createElement("p");

        const time = moment().format("HH:mm:ss")
        // const time = (Date.now() - this.startTime) / 1000;

        if (html) {
            textElem.innerHTML = `[${time}] ${text}`;
        } else {
            textElem.textContent = `[${time}] ${text}`;

            if (color == "green") {
                textElem.classList.add("text-success");
            } else if (color == "red") {
                textElem.classList.add("text-danger");
            }
        }

        this.consoleElem.appendChild(textElem);
        this.consoleElem.scrollTo(0, this.consoleElem.scrollHeight);
    }

    logHTML(text) {
        this.logger(text, "", true);
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
}