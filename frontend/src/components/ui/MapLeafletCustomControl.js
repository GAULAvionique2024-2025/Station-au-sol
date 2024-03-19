// Custom button to toggle launchpads on the map
// It will trigger the function "toggleLaunchPads" in the options object when clicked

import { Control, DomUtil, DomEvent } from "leaflet";

const LAUNCHPAD_IMG_SRC = "/img/launchpad.png";

Control.toggleLaunchPads = Control.extend({
    onAdd(map) {
        const options = this.options;

        const container = DomUtil.create('div', 'leaflet-bar');

        const button = DomUtil.create('button', 'leaflet-toggleLaunchPads-btn', container);
        button.title = "Toggle launchpads"
        DomEvent.on(button, 'click', options.toggleLaunchPads)

        const img = DomUtil.create('img', 'leaflet-toggleLaunchPads-img', button);
        img.src = LAUNCHPAD_IMG_SRC;
        img.style.width = "20px";

        return container;
    },

    onRemove(map) {
        // Nothing to do here
    },
})

export const toggleLaunchPadsControl = options => new Control.toggleLaunchPads(options);