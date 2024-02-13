export default class UI {
    constructor({
        'components': components = {}
    } = {}) {
        this.components = components;

        this.expanded = false;
        this.paused = false;

        this.initEventListener();
    }

    getExpanded() { this.expanded }

    getPaused() { this.paused }

    initEventListener() {
        // Expand button
        document.querySelectorAll('[data-btn="expand"]').forEach((btn) => {
            btn.addEventListener('click', () => this.toggleExpand())
        });

        // Pause button
        document.querySelectorAll('[data-btn="pause"]').forEach((btn) => {
            btn.addEventListener('click', (e) => this.togglePause(e.target))
        });

        // Reset button
        document.querySelectorAll('[data-btn="reset"]').forEach((btn) => {
            btn.addEventListener('click', () => this.reset())
        })
    }

    // Expand button
    toggleExpand() {
        if (!this.expanded) {
            // Open
            document.getElementsByTagName("body")[0].classList.add("expanded")
        } else {
            // Close
            document.getElementsByTagName("body")[0].classList.remove("expanded")
        }
        this.expanded = !this.expanded;
    }

    // Pause button
    togglePause(buttonElem) {
        this.paused = !this.paused;
        if (this.paused) {
            buttonElem.classList.remove("btn-danger");
            buttonElem.classList.add("btn-success");
            buttonElem.textContent = "Resume";

            this.log("Paused");
        } else {
            buttonElem.classList.remove("btn-success");
            buttonElem.classList.add("btn-danger");
            buttonElem.textContent = "Pause";

            this.log("Resumed");
        }
    }

    // Reset button
    reset() {
        for (const component of Object.values(this.components)) {
            component.reset();
        }

        this.log("Reset")
    }
}
