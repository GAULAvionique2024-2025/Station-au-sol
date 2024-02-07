// Classe abstraite qui représente un component de l'interface
export default class MyChart {
    // altitudes = [{time:TEMPS, altitude:ALTITUDE, speed:SPEED, acceleration:ACCELERATION}]
    altitudes = [];

    constructor(nombreMaxDeDonnees = 1000, chartId = 'chartjs', altId = 'alt', speedId = "spd", accId = "acc") {
        // Liens avec les élément du DOM
        this.alt = document.getElementById(altId);
        this.speed = document.getElementById(speedId);
        this.acc = document.getElementById(accId);
        // this.altEnabled = true;
        // this.speedEnabled = true;
        // this.accEnabled = true;
        this.chart = this.createChart(chartId);
        // this.enableToggles();
        this.nombreMaxDeDonnees = nombreMaxDeDonnees;
    }

    // Ajoute des event listener sur les textes Altitude, Speed et Accel.
    // pour activer et désactiver les graphiques
    // enableToggles() {
    //     document.getElementById("alt-text").addEventListener("click", () => {
    //         if (this.altEnabled) {
    //             this.altEnabled = false;
    //             this.chart.data.datasets[0].data = [];
    //         } else {
    //             this.altEnabled = true;
    //             this.chart.data.datasets[0].data = this.altitudesTruncated.map(row => row.altitude);
    //         }
    //         this.chart.update();
    //     });
    //     document.getElementById("speed-text").addEventListener("click", () => {
    //         if (this.speedEnabled) {
    //             this.speedEnabled = false;
    //             this.chart.data.datasets[1].data = [];
    //         } else {
    //             this.speedEnabled = true;
    //             this.chart.data.datasets[1].data = this.altitudesTruncated.map(row => row.speed);
    //         }
    //         this.chart.update();
    //     });
    //     document.getElementById("acc-text").addEventListener("click", () => {
    //         if (this.accEnabled) {
    //             this.accEnabled = false;
    //             this.chart.data.datasets[2].data = [];
    //         } else {
    //             this.accEnabled = true;
    //             this.chart.data.datasets[2].data = this.altitudesTruncated.map(row => row.acceleration);
    //         }
    //         this.chart.update();
    //     });
    // }

    // Crée et configure le graphique
    createChart(chartId = "chart") {
        const canvas = document.getElementById(chartId);
        const datasets = [];
        // if (this.altEnabled) {
        datasets.push({
            label: "ALT",
            data: this.altitudes.map(row => row.altitude),
        });
        // }
        // if (this.speedEnabled) {
        datasets.push({
            label: "SPD",
            data: this.altitudes.map(row => row.speed),
            yAxisID: 'y1',
        });
        // }
        // if (this.accEnabled) {
        datasets.push({
            label: "ACC",
            data: this.altitudes.map(row => row.acceleration),
            yAxisID: 'y1',
        });
        // }

        return new Chart(canvas, {
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
                            drawOnChartArea: false, // only show the grid lines for one axis
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
        this.altitudesTruncated = this.altitudes.slice(-this.nombreMaxDeDonnees);

        // Mets à jour les données du graphique (l'axe des x = labels = temps et l'axe des y = datasets = altitude)
        this.chart.data.labels = this.altitudesTruncated.map(row => row.time);

        // if (this.altEnabled) {
        this.chart.data.datasets[0].data = this.altitudesTruncated.map(row => row.altitude);
        // }
        // if (this.speedEnabled) {
        this.chart.data.datasets[1].data = this.altitudesTruncated.map(row => row.speed);
        // }
        // if (this.accEnabled) {
        this.chart.data.datasets[2].data = this.altitudesTruncated.map(row => row.acceleration);
        // }

        // Update le graphique
        this.chart.update();
    }

    // Update le texte de l'affichage de l'altitude
    updateValues(data) {
        this.alt.textContent = data.altitude;
        this.speed.textContent = data.speed;
        this.acc.textContent = data.acceleration;
    }

    // Update le component
    update(data) {
        this.updateChart(data);
        this.updateValues(data);
    }

    // Remet le component à son état initial
    reset() {
        this.alt.textContent = "0";
        this.speed.textContent = "0";
        this.acc.textContent = "0";
        this.altitudes = [];
        this.chart.data.labels = [];
        this.chart.data.datasets[0].data = [];
        this.chart.data.datasets[1].data = [];
        this.chart.data.datasets[2].data = [];
        this.chart.update();
    }
}