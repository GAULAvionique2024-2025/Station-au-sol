export default class expandBtn {
    constructor() {
        this.expanded = false;

        this.initEventListener();
    }

    initEventListener() {
        document.querySelectorAll('[data-btn="expand"]').forEach((btn) => {
            btn.addEventListener('click', () => this.toggleExpand());
        });
    }

    toggleExpand() {
        if (!this.expanded) {
            // Open
            document.getElementsByTagName("body")[0].classList.add("expanded");
        } else {
            // Close
            document.getElementsByTagName("body")[0].classList.remove("expanded");
        }
        this.expanded = !this.expanded;
    }
}