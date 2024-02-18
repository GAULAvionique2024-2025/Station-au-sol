export default class expandBtn {
    constructor({
        'socket': socket = undefined,
    } = {}) {
        // To send data to the server (config, commands, etc.)
        this.socket = socket;

        this.settingsOpen = false;

        this.initEventListener();

        // Get available ports from the server
        this.initSettings();
    }

    initEventListener() {
        // Settings button
        document.querySelectorAll('[data-btn="settings"]').forEach((btn) => {
            btn.addEventListener('click', () => this.toggleSettings());
        })

        // Close settings when the user clicks outside the settings
        document.querySelectorAll('[data-btn="settings-closer"]').forEach((elem) => {
            elem.addEventListener("click", () => this.closeSettings());
        })

        // Close settings when the user presses the escape key
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") { this.closeSettings() }
        });

        // Update path when the user selects a new one
        document.getElementById("available-paths").addEventListener("change", (e) => {
            this.socket.setPath(e.target.value);
        });
    }

    // Initialize settings
    initSettings() {
        // Get available paths from server
        this.socket.getPaths((paths) => {
            if (paths) {
                this.setAvailablePaths(paths);
            } else {
                console.log("No available ports, retrying in 1s...")
                setTimeout(() => {
                    this.initSettings();
                }, 1000);
            }
        });
    }

    // Set available paths in the select element of the settings
    setAvailablePaths(paths) {
        // Clear select element
        document.getElementById("available-paths").innerHTML = '';

        for (const path of paths.availablePaths) {
            // Add options to select element
            const option = document.createElement("option");
            option.value = path;
            option.textContent = path;

            // Set current path as selected
            if (path === paths.path) {
                option.setAttribute("selected", "");
            }

            document.getElementById("available-paths").appendChild(option);
        }
    }

    // Settings button
    toggleSettings() {
        if (!this.settingsOpen) {
            // Open
            document.getElementsByTagName("body")[0].classList.add("settings-opened");
        } else {
            // Close
            document.getElementsByTagName("body")[0].classList.remove("settings-opened");
        }
        this.settingsOpen = !this.settingsOpen;
    }

    // Close settings when the user clicks outside the settings or close button
    closeSettings() {
        document.getElementsByTagName("body")[0].classList.remove("settings-opened");
        this.settingsOpen = false;
    }
}