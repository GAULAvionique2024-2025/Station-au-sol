/**
 * Reset button
 * @module ui/resetBtn
 */

export default class resetBtn {
    constructor({
        'components': components = {},
    } = {}) {
        // To log to the console component
        this.components = components;

        this.initEventListener();
    }

    initEventListener() {
        document.querySelectorAll('[data-btn="reset"]').forEach((btn) => {
            btn.addEventListener('click', () => this.reset());
        })
    }

    reset() {
        this.components.resetAll();
        this.components.log("Reset");
    }
}