// Classe abstraite qui représente un component de l'interface
class Component {
    update(data) {
        // Update le component avec les données
    }

    reset() {
        // Remet le component à son état initial
    }
}

// Component qui affiche l'altitude, la vitesse et l'acceleration sur un graphique
class AltitudeSpeedAcceleration extends Component {
    // altitudes = [{time:TEMPS, altitude:ALTITUDE, speed:SPEED, acceleration:ACCELERATION}]
    altitudes = [];

    constructor(chartId = 'chart', altId = 'alt-value', speedId = "speed-value", accId = "acc-value", altUnits = " m", speedUnits = " m/s", accUnits = " m/s²") {
        super();
        // Liens avec les élément du DOM
        this.altElem = document.getElementById(altId);
        this.speedElem = document.getElementById(speedId);
        this.accElem = document.getElementById(accId);
        this.altUnits = altUnits;
        this.speedUnits = speedUnits;
        this.accUnits = accUnits;
        this.chartId = chartId;
        this.altEnabled = true;
        this.speedEnabled = true;
        this.accEnabled = true;
        this.chart = this.createChart();
        this.enableToggles();
    }

    // Ajoute des event listener sur les textes Altitude, Speed et Accel.
    // pour activer et désactiver les graphiques
    enableToggles() {
        document.getElementById("alt-text").addEventListener("click", () => {
            if (this.altEnabled) {
                this.altEnabled = false;
                this.chart.data.datasets[0].data = [];
            } else {
                this.altEnabled = true;
                this.chart.data.datasets[0].data = this.altitudesTruncated.map(row => row.altitude);
            }
            this.chart.update();
        });
        document.getElementById("speed-text").addEventListener("click", () => {
            if (this.speedEnabled) {
                this.speedEnabled = false;
                this.chart.data.datasets[1].data = [];
            } else {
                this.speedEnabled = true;
                this.chart.data.datasets[1].data = this.altitudesTruncated.map(row => row.speed);
            }
            this.chart.update();
        });
        document.getElementById("acc-text").addEventListener("click", () => {
            if (this.accEnabled) {
                this.accEnabled = false;
                this.chart.data.datasets[2].data = [];
            } else {
                this.accEnabled = true;
                this.chart.data.datasets[2].data = this.altitudesTruncated.map(row => row.acceleration);
            }
            this.chart.update();
        });
    }

    // Crée et configure le graphique
    createChart() {
        const ctx = document.getElementById(this.chartId);
        const datasets = [];
        if (this.altEnabled) {
            datasets.push({
                label: "ALT",
                data: this.altitudes.map(row => row.altitude),
            });
        }
        if (this.speedEnabled) {
            datasets.push({
                label: "SPD",
                data: this.altitudes.map(row => row.speed),
                yAxisID: 'y1',
            });
        }
        if (this.accEnabled) {
            datasets.push({
                label: "ACC",
                data: this.altitudes.map(row => row.acceleration),
                yAxisID: 'y1',
            });
        }
        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.altitudes.map(row => row.temps),
                datasets: datasets,
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                animation: false,
                pointRadius: 2,
                pointHoverRadius: 3,
                borderWidth: 2,
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: {
                            drawOnChartArea: false, // only want the grid lines for one axis to show up
                        },
                    },
                },
            },
        });
    }

    // Ajoute une nouvelle altitude au graphique
    updateChart(data) {
        // Ajoute les données à la liste des altitudes
        this.altitudes.push({ time: data.time, altitude: data.altitude, speed: data.speed, acceleration: data.acceleration });

        // Limite le nombre de données affichées à une constante (1000 par ex.)
        this.altitudesTruncated = this.altitudes.slice(-page.nombreMaxDeDonnees);

        // Mets à jour les données du graphique (l'axe des x = labels = temps et l'axe des y = datasets = altitude)
        this.chart.data.labels = this.altitudesTruncated.map(row => row.time);

        if (this.altEnabled) {
            this.chart.data.datasets[0].data = this.altitudesTruncated.map(row => row.altitude);
        }
        if (this.speedEnabled) {
            this.chart.data.datasets[1].data = this.altitudesTruncated.map(row => row.speed);
        }
        if (this.accEnabled) {
            this.chart.data.datasets[2].data = this.altitudesTruncated.map(row => row.acceleration);
        }

        // Update le graphique
        this.chart.update();
    }

    // Update le texte de l'affichage de l'altitude
    updateValues(data) {
        this.altElem.textContent = data.altitude + this.altUnits;
        this.speedElem.textContent = data.speed + this.speedUnits;
        this.accElem.textContent = data.acceleration + this.accUnits;
    }

    // Update le component
    update(data) {
        this.updateChart(data);
        this.updateValues(data);
    }

    // Remet le component à son état initial
    reset() {
        this.altElem.textContent = "0" + this.altUnits;
        this.speedElem.textContent = "0" + this.speedUnits;
        this.accElem.textContent = "0" + this.accUnits;
        this.altitudes = [];
        this.chart.data.labels = [];
        this.chart.data.datasets[0].data = [];
        this.chart.data.datasets[1].data = [];
        this.chart.data.datasets[2].data = [];
        this.chart.update();
    }
}


// Zone de texte qui affiche les données reçues
class Console {
    constructor(consoleId = "console-text") {
        this.consoleElem = document.getElementById(consoleId);
        this.startTime = Date.now();
        this.log("Started")
    }

    log(text, color = "") {
        const textElem = document.createElement("p");

        const time = (Date.now() - this.startTime) / 1000;
        textElem.textContent = `[${time}] ${text}`;

        if (color == "green") {
            textElem.classList.add("text-success");
        } else if (color == "red") {
            textElem.classList.add("text-danger");
        }

        this.consoleElem.appendChild(textElem);
        this.consoleElem.scrollTo(0, this.consoleElem.scrollHeight);
    }

    update(data) {
        // Skip
    }

    reset() {
        this.log("Reset")
    }
}


// Carte qui affiche la position de la fusée
class MyMap extends Component {
    constructor(startLatLon = [46.8, -71.3], startZoom = 14, mapId = "map", coordsId = "map-coords") {
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
        this.mapId = mapId;
        // Crée la carte
        this.map = this.createMap();
        // Crée le markeur de la fusée et l'ajoute sur la carte
        this.markers.fusee = this.createFuseeMarker();
        // Crée la polyline qui représente le chemin de la fusée
        this.polyline = L.polyline([], { color: 'grey' }).addTo(this.map);
        // Récupère la position de l'utilisateur et l'ajoute à la carte
        this.markers.userPos = this.getUserPosition();
        // Id de l'élément qui affiche les coordonnées
        this.coordsId = coordsId;
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

class Checks extends Component {
    constructor(battId = "batt-state", igniId = "igni-state", gpsId = "gps-state", connId = "conn-value", connUnits = " s ago") {
        super();
        this.battElem = document.getElementById(battId);
        this.igniElem = document.getElementById(igniId);
        this.gpsElem = document.getElementById(gpsId);
        this.connElem = document.getElementById(connId);
        this.connUnits = connUnits;
        this.timer = 0;
        this.timerInterval = setInterval(() => {
            this.addSecond();
        }, 1000);
    }

    updateBatt(data) {
        if (data.batt_check == "1") {
            this.battElem.textContent = "OK";
            this.battElem.classList.add("text-success");
            this.battElem.classList.remove("text-danger");
        } else {
            this.battElem.textContent = "ERROR";
            this.battElem.classList.add("text-danger");
            this.battElem.classList.remove("text-success");
        }
    }

    updateIgni(data) {
        if (data.igniter_check == "1") {
            this.igniElem.textContent = "(8/8) OK";
            this.igniElem.classList.add("text-success");
            this.igniElem.classList.remove("text-danger");
        } else {
            this.igniElem.textContent = "ERROR";
            this.igniElem.classList.add("text-danger");
            this.igniElem.classList.remove("text-success");
        }
    }

    updateGPS(data) {
        if (data.gps_check == "1") {
            this.gpsElem.textContent = "OK";
            this.gpsElem.classList.add("text-success");
            this.gpsElem.classList.remove("text-danger");
        } else {
            this.gpsElem.textContent = "ERROR";
            this.gpsElem.classList.add("text-danger");
            this.gpsElem.classList.remove("text-success");
        }
    }

    addSecond() {
        this.timer += 1;
        this.connElem.textContent = this.timer + this.connUnits;
    }

    updateConn() {
        // Reset interval
        clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            this.addSecond();
        }, 1000)

        // Set timer to 0 s
        this.timer = 0;
        this.connElem.textContent = this.timer + this.connUnits;
    }

    update(data) {
        this.updateBatt(data);
        this.updateIgni(data);
        this.updateGPS(data);
        this.updateConn();
    }

    reset() {
        this.battElem.textContent = "ERROR";
        this.battElem.classList.add("text-danger");
        this.battElem.classList.remove("text-success");
        this.igniElem.textContent = "ERROR";
        this.igniElem.classList.add("text-danger");
        this.igniElem.classList.remove("text-success");
        this.gpsElem.textContent = "ERROR";
        this.gpsElem.classList.add("text-danger");
        this.gpsElem.classList.remove("text-success");
        updateConn();
    }
}

class IMU extends Component {
    // orientations = [{pitch:PITCH, roll:ROLL, yaw:YAW}]
    orientations = [];

    constructor(pitchId = 'pitch-value', yawId = 'yaw-value', rollId = 'roll-value', units = "°") {
        super();
        // Id des éléments html
        this.pitchElem = document.getElementById(pitchId);
        this.yawElem = document.getElementById(yawId);
        this.rollElem = document.getElementById(rollId);
        this.units = units;
        // Create Three.js scene
        window.createScene("ori-view");
    }

    updateValues(data) {
        this.pitchElem.textContent = data.pitch + this.units;
        this.yawElem.textContent = data.yaw + this.units;
        this.rollElem.textContent = data.roll + this.units;
    }

    update(data) {
        this.updateValues(data);
        window.rotateModel(data.pitch, data.yaw, data.roll);
    }

    reset() {
        this.pitchElem.textContent = "0" + this.units;
        this.yawElem.textContent = "0" + this.units;
        this.rollElem.textContent = "0" + this.units;
    }
}

class TempVibrLand extends Component {
    constructor(tempId = "temp-value", vibrId = "vibr-value", landId = "land-value", tempUnits = " °C", vibrUnits = " Hz", landUnits = " m/s²") {
        super();
        this.tempElem = document.getElementById(tempId);
        this.vibrElem = document.getElementById(vibrId);
        this.landElem = document.getElementById(landId);
        this.tempUnits = tempUnits;
        this.vibrUnits = vibrUnits;
        this.landUnits = landUnits;
    }

    updateTemp(data) {
        this.tempElem.textContent = data.temperature + this.tempUnits;
    }

    updateVibrations(data) {
        this.vibrElem.textContent = data.vibrations + this.vibrUnits;
    }

    updateLanding(data) {
        this.landElem.textContent = data.landing_force + this.landUnits;
    }

    update(data) {
        this.updateTemp(data);
        this.updateVibrations(data);
        this.updateLanding(data);
    }

    reset() {
        this.tempElem.textContent = "0" + this.tempUnits;
        this.vibrElem.textContent = "0" + this.vibrUnits;
        this.landElem.textContent = "0" + this.landUnits;
    }
}

