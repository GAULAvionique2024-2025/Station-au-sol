export default class Console {
    constructor({
        'consoleId': consoleId = "console-text"
    } = {}) {
        this.consoleElem = document.getElementById(consoleId);
        this.startTime = Date.now();
        this.log("Started")
    }

    log(text, color = "") {
        const textElem = document.createElement("p");

        const time = (Date.now() - this.startTime) / 1000;
        textElem.textContent = `[${time}] ${text}`;

        if (color == "green") {
            textElem.classList.add("text-sucess");
        } else if (color == "red") {
            textElem.classList.add("text-danger");
        }

        this.consoleElem.appendChild(textElem);
        this.consoleElem.scrollTo(0, this.consoleElem.scrollHeight);
    }

    update(data) {

    }

    reset() {

    }
}