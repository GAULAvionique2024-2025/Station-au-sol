// Format de data:
// {
//     time: TEMPS,
//     alt: ALTITUDE,
//     pitch: PITCH,
//     roll: ROLL,
//     yaw: YAW,
//     lat: LAT,
//     lon: LON,
// }


// Classe abstraite qui représente un composant de l'interface
class Component {
    update(data) {
        // Update le component avec le data
    }

    reset() {
        // Remet le component à son état initial
    }
}


// Composant qui a un affichage text (alt-value) ainsi que d'un graphique (alt-chart)
class Altitude extends Component {
    // altitudes = [{time:TEMPS, alt:ALT}]
    altitudes = [];

    constructor(valueId = 'alt-value', chartId = 'alt-chart') {
        super();
        // Id de l'élément html qui affiche l'altitude
        this.valueId = valueId;
        // Id du canvas qui affiche le graphique
        this.chartId = chartId;
        this.chart = this.createChart();
    }

    // Crée et configure le graphique
    createChart() {
        const ctx = document.getElementById(this.chartId);
        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.altitudes.map(row => row.temps),
                datasets: [{
                    data: this.altitudes.map(row => row.altitude),
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    // zoom: {
                    //     zoom: {
                    //         wheel: {
                    //             enabled: true,
                    //         },
                    //         pinch: {
                    //             enabled: true
                    //         },
                    //         mode: 'x',
                    //     }
                    // }
                }
            },
        });
    }

    // Ajoute une nouvelle altitude au graphique
    updateChart(data) {
        // Ajoute le data à la liste des altitudes
        this.altitudes.push({ time: data.time, altitude: data.altitude });

        // Limite le nombre de données affichées à 1000
        this.altitudesTruncated = this.altitudes.slice(-nombreMaxDeDonnees);

        // Mets à jour les données du graphique (l'axe des x = labels : temps et l'axe des y = datasets : altitude)
        this.chart.data.labels = this.altitudesTruncated.map(row => row.time);
        this.chart.data.datasets[0].data = this.altitudesTruncated.map(row => row.altitude);

        // Update le graphique
        this.chart.update();
    }

    // Update le texte de l'affichage de l'altitude
    updateValue(data) {
        document.getElementById(this.valueId).textContent = data.altitude + " m";
    }

    // Update le component
    update(data) {
        this.updateChart(data);
        this.updateValue(data);
    }

    // Remet le component à son état initial
    reset() {
        document.getElementById(this.valueId).textContent = "0 m";
        this.altitudes = [];
        this.chart.data.labels = [];
        this.chart.data.datasets[0].data = [];
        this.chart.update();
    }
}


// Zone de texte qui affiche les données reçues
class Console extends Component {
    constructor() {
        super();
        // À faire
    }

    update(data) {
        console.log(data);
    }

    reset() {
        // À faire
    }
}


// Carte qui affiche la position de la fusée
class MyMap extends Component {
    constructor(startLatLon = [46.8, -71.3], startZoom = 10) {
        super();
        // Liste des coordonnées de la fusée
        this.latlngs = [];
        // Json des markeurs de la carte
        this.markers = {};
        // Json des icons pour la carte
        this.icons = this.createIcons();
        // Position de départ de la carte
        this.startLatLon = startLatLon;
        this.startZoom = startZoom;
        // Id du div qui affiche la carte
        this.mapId = 'map';
        // Crée la carte
        this.map = this.createMap();
        // Crée le markeur de la fusée et l'ajoute sur la carte
        this.markers.fusee = this.createFuseeMarker();
        // Crée la polyline qui représente le chemin de la fusée
        this.polyline = L.polyline([], { color: 'grey' }).addTo(this.map);
        // Récupère la position de l'utilisateur et l'ajoute à la carte
        this.markers.userPos = this.getUserPosition();
    }

    createMap() {
        const map = L.map(this.mapId).setView(this.startLatLon, this.startZoom);
        // Ajoute le background de la carte
        // IL FAUT UNE CONNEXION INTERNET POUR QUE ÇA MARCHE, À REVOIR
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
        return map;
    }

    createIcons() {
        return {
            fusee: L.icon({
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
    createFuseeMarker() {
        const marker = L.marker([0, 0], { icon: this.icons.fusee }).addTo(this.map);
        marker.bindPopup("<b>Position de la fusée</b>");
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
        document.getElementById('map-coords').textContent = `${data.lat}, ${data.lon}`;
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
        this.latlngsTruncated = this.latlngs.slice(-nombreMaxDeDonnees);
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
        document.getElementById('map-coords').textContent = "0.0000, 0.0000";
        this.latlngs = [];
        this.marker.setLatLng([0, 0]);
        this.polyline.setLatLngs([]);
    }
}

class IMU extends Component {
    // orientations = [{pitch:PITCH, roll:ROLL, yaw:YAW}]
    orientations = [];

    constructor(pitchId = 'pitch-value', yawId = 'yaw-value', rollId = 'roll-value') {
        super();
        // Id des éléments html
        this.pitchId = pitchId;
        this.yawId = yawId;
        this.rollId = rollId;
    }

    updateValues(data) {
        document.getElementById(this.pitchId).textContent = data.pitch + "°";
        document.getElementById(this.yawId).textContent = data.yaw + "°";
        document.getElementById(this.rollId).textContent = data.roll + "°";
    }

    update(data) {
        this.updateValues(data);
    }

    reset() {
        document.getElementById(this.pitchId).textContent = "0°";
        document.getElementById(this.yawId).textContent = "0°";
        document.getElementById(this.rollId).textContent = "0°";
    }
}