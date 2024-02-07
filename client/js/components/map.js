import {
    map as Lmap,
    tileLayer as LtileLayer,
    icon as Licon,
    marker as Lmarker,
    polyline as Lpolyline
} from '../lib/leaflet-src.esm.mjs'

export default class Map {
    constructor(mapId = "leaflet-map", startLatLng = [46.8, -71.3], startZoom = 14, coordsId = "coords") {
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
        this.polyline = Lpolyline([], { color: 'grey' }).addTo(this.map);
        // Get the user position from the browser
        this.markers.userPos = this.getUserPosition();
        // Element holding the coords value
        this.coordsElem = document.getElementById(coordsId);
    }

    createMap(mapId = "map", startLatLng = [46.8, -71.3], startZoom = 12) {
        const map = Lmap(mapId).setView(startLatLng, startZoom);
        // IL FAUT UNE CONNEXION INTERNET POUR QUE ÇA MARCHE, À REVOIR (Télécharger les tuiles en local)
        LtileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
        return map;
    }

    createIcons() {
        return {
            rocket: Licon({
                iconUrl: 'img/fusee_icon.png',
                iconSize: [20, 20],
                iconAnchor: [10, 10],
                popupAnchor: [0, -10],
            }),
            userPos: Licon({
                iconUrl: 'img/user_pos.png',
                iconSize: [16, 16],
                iconAnchor: [8, 8],
                popupAnchor: [0, -8],
            })
        }
    }

    // Crée le marker de la fusée et l'ajoute à la carte
    createRocketMarker() {
        const marker = Lmarker([0, 0], { icon: this.icons.rocket }).addTo(this.map);
        marker.bindPopup("<b>Rocket position</b>");
        return marker;
    }

    // Récupère la position de l'utilisateur et l'ajoute à la carte
    getUserPosition() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const latLng = [position.coords.latitude, position.coords.longitude];
                const marker = Lmarker(latLng, { icon: this.icons.userPos }).addTo(this.map);
                marker.bindPopup("<b>Vous êtes ici</b>");
                this.map.setView(latLng);
                return marker;
            });
        }
    }

    // Mets à jour le texte qui affiche les coordonnées de la fusée
    updateCoords(data) {
        this.coordsElem.textContent = `${data.lat}, ${data.lon}`;
    }

    // Bouge le markeur de la fusée sur la carte et centre la carte dessus
    updateMap(data) {
        // Bouge le marker de la fusée
        this.markers.rocket.setLatLng([data.lat, data.lon]);
        // Centre sur la fusée
        this.map.setView([data.lat, data.lon]);
        // Ajoute les coordonnées à la polyline
        this.latlngs.push([data.lat, data.lon]);
        // Limite le nombre de coordonnées à 1000
        this.latlngsTruncated = this.latlngs.slice(-this.nombreMaxDeDonnees);
        // Ajoute le trait sur la carte
        this.polyline.setLatLngs(this.latlngsTruncated);
    }

    // Update le component
    update(data) {
        this.updateCoords(data);
        this.updateMap(data);
    }

    // Remet le component à son état initial
    reset() {
        this.coordsElem.textContent = "0.0000, 0.0000";
        this.latlngs = [];
        this.markers.rocket.setLatLng([0, 0]);
        this.polyline.setLatLngs([]);
    }
}
