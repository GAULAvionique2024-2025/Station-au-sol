/**
 * Module to handle interactions with the UI and update the interface/config
 * @module UI
 */

import expandBtn from './ui/expandBtn.js';
import pauseBtn from './ui/pauseBtn.js';
import resetBtn from './ui/resetBtn.js';
import settings from './ui/settings.js';

export default class UI {
    constructor({
        'states': states = {},
        'components': components = null,
        'socket': socket = null,
    } = {}) {
        // Application states
        this.states = states;
        // To access and update the components
        this.components = components;
        // To send data to the server
        this.socket = socket;

        this.ui = {
            'expandBtn': new expandBtn(),
            'pauseBtn': new pauseBtn({
                'states': this.states,
                'components': this.components,
            }),
            'resetBtn': new resetBtn({
                'components': this.components,
            }),
            'settings': new settings({
                'socket': this.socket,
            }),
        };
    }
}
