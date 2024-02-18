export default class pauseBtn {
    constructor({
        'states': states = {},
        'components': components = {},
    } = {}) {
        // Application states
        this.states = states;
        // To log to the console component
        this.components = components;

        this.initEventListener();
    }

    initEventListener() {
        document.querySelectorAll('[data-btn="pause"]').forEach((btn) => {
            btn.addEventListener('click', (e) => this.togglePause(e.target));
        });
    }

    togglePause(buttonElem) {
        this.states.paused = !this.states.paused;
        if (this.states.paused) {
            buttonElem.classList.remove("btn-danger");
            buttonElem.classList.add("btn-success");
            buttonElem.textContent = "Resume";

            this.components.log("Paused");
        } else {
            buttonElem.classList.remove("btn-success");
            buttonElem.classList.add("btn-danger");
            buttonElem.textContent = "Pause";

            this.components.log("Resumed");
        }
    }
}