// Data format:
// {
//     temps: TEMPS,
//     alt: ALT,
//     vit: VIT,
//     lat: LAT,
//     lon: LON,
//     altGPS: ALTGPS,
// }

class Component {
    update(data) {
        //Update le component avec le data
    }
}

class Altitude extends Component {
    // altitudes = [{temps:TEMPS, alt:ALT}]
    altitudes = [];

    constructor() {
        super()
        this.chart = this.createChart();
    }

    createChart() {
        const ctx = document.getElementById('alt-chart');
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
                }
            },
        });
    }

    updateChart(data) {
        // Ajoute le data à la liste altitudes
        this.altitudes.push({ temps: data.temps, alt: data.alt })

        // Mets à jour les données du graphique (l'axe des x: labels et l'axe des y: datasets)
        this.chart.data.labels = this.altitudes.map(row => row.temps)
        this.chart.data.datasets[0].data = this.altitudes.map(row => row.alt)

        // Update le graphique
        this.chart.update()
    }

    updateValue(data) {
        // Update le texte de l'affichage de l'altitude
        document.getElementById('alt-value').textContent = data.alt + " m"
    }

    // Update le component
    update(data) {
        this.updateChart(data)
        this.updateValue(data)
    }
}

const altComponent = new Altitude();

// Debug ===============================================
let temps_tmp = 0
function addAlt() {
    data = {
        temps: temps_tmp,
        alt: document.getElementById('alt-input').value
    }
    temps_tmp += 1
    altComponent.update(data)
}
// Debug ===============================================