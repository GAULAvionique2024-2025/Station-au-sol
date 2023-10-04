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
        //Update le component avec le data
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
                    data: this.altitudes.map(row => row.alt),
                }]
            },
            options: {
                responsive: true,
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
        this.altitudes.push({ time: data.time, alt: data.alt });

        // Mets à jour les données du graphique (l'axe des x = labels : temps et l'axe des y = datasets : altitude)
        this.chart.data.labels = this.altitudes.map(row => row.time);
        this.chart.data.datasets[0].data = this.altitudes.map(row => row.alt);

        // Update le graphique
        this.chart.update();
    }

    // Update le texte de l'affichage de l'altitude
    updateValue(data) {
        document.getElementById(this.valueId).textContent = data.alt + " m";
    }

    // Update le component
    update(data) {
        this.updateChart(data);
        this.updateValue(data);
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
}


// Carte qui affiche la position de la fusée
class MyMap extends Component {
    constructor(startLatLon = [46.8, -71.3], startZoom = 10) {
        super();
        // Position de départ de la carte
        this.startLatLon = startLatLon;
        this.startZoom = startZoom;
        // Id du div qui affiche la carte
        this.mapId = 'map';
        // Crée la carte
        this.map = this.createMap();
        // Icon de la fusée
        this.icon = L.icon({
            iconUrl: 'img/fusee_icon.png',
            iconSize: [20, 20],
            iconAnchor: [10, 10],
            popupAnchor: [0, -10],
        })
        // Crée le marker de la fusée et l'ajoute sur la carte
        this.marker = this.createMarker();
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

    // Crée le marker de la fusée et l'ajoute à la carte
    createMarker() {
        const marker = L.marker([0, 0], { icon: this.icon }).addTo(this.map);
        marker.bindPopup("<b>Position de la fusée</b>");
        return marker;
    }

    // Mets à jour le text qui affiche les coordonnées de la fusée
    updateCoords(data) {
        document.getElementById('map-coords').textContent = `${data.lat}, ${data.lon}`;
    }

    // Bouge le marker sur la carte et centre la carte dessus
    updateMap(data) {
        this.marker.setLatLng([data.lat, data.lon]);
        // Default zoom?
        // this.map.setView([data.lat, data.lon], 13);
        this.map.setView([data.lat, data.lon]);
    }

    // Update le component
    update(data) {
        this.updateCoords(data);
        this.updateMap(data);
    }
}