export default class Map {
    constructor(startLatLng = [46.8, -71.3], startZoom = 14, mapId = "leaflet-map", latId = "lat", lngId = "lng") {
        // List of rocket coordinates
        this.latlngs = [];
        // object with all the markers of the map
        this.markers = {};
        // object with all the icons for the map
        this.icons = this.createIcons();
        // Starting position of the map
        this.startLatLng = startLatLng;
        this.startZoom = startZoom;
        // div Id of the map
        this.mapId = mapId;
        // Create the map element
        this.map = this.createMap();
        // Create the rocket marker
        this.markers.rocket = this.createRocketMarker();
        // Create the polyline showing the path of the rocket
        this.polyline = L.polyline([], { color: 'grey' }).addTo(this.map);
        // Get the user position from the browser
        this.markers.userPos = this.getUserPosition();
        // element Id holding the latitude value
        this.latId = latId;
        // element Id holding the longitude value
        this.lonId = lonId;
    }

    createMap() {
        const map = L.map(this.mapId).setView(this.startLatLon, this.startZoom);
        // Ajoute le background de la carte
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
                iconUrl: 'img/fusee_icon.png',
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

    // Crée le marker de la fusée et l'ajoute à la carte
    createRocketMarker() {
        const marker = L.marker([0, 0], { icon: this.icons.rocket }).addTo(this.map);
        marker.bindPopup("<b>Rocket position</b>");
        return marker;
    }

    // Récupère la position de l'utilisateur et l'ajoute à la carte
    getUserPosition() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const latLon = [position.coords.latitude, position.coords.longitude];
                const marker = L.marker(latLon, { icon: this.icons.userPos }).addTo(this.map);
                marker.bindPopup("<b>Vous êtes ici</b>");
                this.map.setView(latLon);
                return marker;
            });
        }
    }

    // Mets à jour le texte qui affiche les coordonnées de la fusée
    updateCoords(data) {
        document.getElementById(this.coordsId).textContent = `${data.lat}, ${data.lon}`;
    }

    // Bouge le markeur de la fusée sur la carte et centre la carte dessus
    updateMap(data) {
        // Bouge le marker
        this.markers.fusee.setLatLng([data.lat, data.lon]);
        // Default zoom?
        // this.map.setView([data.lat, data.lon], 13);
        this.map.setView([data.lat, data.lon]);
        // Ajoute les coordonnées à la polyline
        this.latlngs.push([data.lat, data.lon]);
        // Limite le nombre de coordonnées à 1000
        this.latlngsTruncated = this.latlngs.slice(-page.nombreMaxDeDonnees);
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
        document.getElementById(this.coordsId).textContent = "0.0000, 0.0000";
        this.latlngs = [];
        this.markers.fusee.setLatLng([0, 0]);
        this.polyline.setLatLngs([]);
    }
}