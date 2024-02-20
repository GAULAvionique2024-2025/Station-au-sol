/**
 * Map component (display rocket position on a map)
 * @module components/Map
 */

import ComponentClass from './componentClass.js';

export default class Map extends ComponentClass {
    constructor({
        'mapId': mapId = "leaflet-map",
        'startLatLng': startLatLng = [46.8, -71.3],
        'startZoom': startZoom = 14,
        'coordsId': coordsId = "coords"
    } = {}) {
        super();
        // List of rocket coordinates
        this.latlngs = [];
        // Object with all the markers of the map
        this.markers = {};
        // Object with all the icons for the map
        this.icons = this.createIcons();
        // Create the map element
        this.map = this.createMap(mapId, startLatLng, startZoom);
        // Create the rocket marker
        this.markers.rocket = this.createRocketMarker();
        // Create the polyline showing the path of the rocket
        this.polyline = L.polyline([], { color: 'grey' }).addTo(this.map);
        // Get the user position from the browser
        this.markers.userPos = this.getUserPosition();
        // Element holding the coords value
        this.coordsElem = document.getElementById(coordsId);
    }

    createMap(mapId = "map", startLatLng = [46.8, -71.3], startZoom = 12) {
        const map = L.map(mapId).setView(startLatLng, startZoom);
        // IL FAUT UNE CONNEXION INTERNET POUR QUE ÇA MARCHE, À REVOIR (Télécharger les tuiles en local)
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
        return map;
    }

    createIcons() {
        return {
            rocket: L.icon({
                iconUrl: 'img/fusee_icon.svg',
                iconSize: [20, 20],
                iconAnchor: [10, 10],
                popupAnchor: [0, -10],
            }),
            userPos: L.icon({
                iconUrl: 'img/user_pos.png',
                iconSize: [16, 16],
                iconAnchor: [8, 8],
                popupAnchor: [0, -8],
            })
        }
    }

    // Create Rocket marker and add it to the map
    createRocketMarker() {
        const marker = L.marker([0, 0], { icon: this.icons.rocket }).addTo(this.map);
        marker.bindPopup("<b>Rocket position</b>");
        return marker;
    }

    // Get the user position from the browser and add a marker to the map
    getUserPosition() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const latLng = [position.coords.latitude, position.coords.longitude];
                const marker = L.marker(latLng, { icon: this.icons.userPos }).addTo(this.map);
                marker.bindPopup("<b>Vous êtes ici</b>");
                this.map.setView(latLng);
                return marker;
            });
        }
    }

    // Update the coordinates element with the new position
    updateCoords(data) {
        this.coordsElem.textContent = `${data.lat}, ${data.lon}`;
    }

    // Move the rocket marker, focus the map on the marker and update the polyline
    updateMap(data) {
        // Move the rocket marker
        this.markers.rocket.setLatLng([data.lat, data.lon]);
        // Focus the map on the rocket marker
        this.map.setView([data.lat, data.lon]);
        // Update the polyline
        this.latlngs.push([data.lat, data.lon]);
        // Limit the number of data points to the last 1000
        this.latlngsTruncated = this.latlngs.slice(-this.nombreMaxDeDonnees);
        // Add the new data point to the polyline
        this.polyline.setLatLngs(this.latlngsTruncated);
    }

    // Update the component
    update(data) {
        this.updateCoords(data);
        this.updateMap(data);
    }

    // Reset the component
    reset() {
        this.coordsElem.textContent = "0.0000, 0.0000";
        this.latlngs = [];
        this.markers.rocket.setLatLng([0, 0]);
        this.polyline.setLatLngs([]);
    }
}
