// Data format:
// {
//     time: TEMPS,
//     alt: ALT,
//     pitch: VIT,
//     roll: LAT,
//     yaw: LON,
// }

class Component {
    update(data) {
        //Update le component avec le data
    }
}


// Composé d'un affichage text (alt-value) ainsi que d'un graphique (alt-chart)
class Altitude extends Component {
    // altitudes = [{temps:TEMPS, alt:ALT}]
    altitudes = [];

    constructor(valueId = 'alt-value', chartId = 'alt-chart') {
        super()
        // Id de l'élément html qui affiche l'altitude
        this.valueId = valueId
        // Id du canvas qui affiche le graphique
        this.chartId = chartId
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
                }
            },
        });
    }

    // Ajoute une nouvelle altitude au graphique
    updateChart(data) {
        // Ajoute le data à la liste des altitudes
        this.altitudes.push({ time: data.time, alt: data.alt })

        // Mets à jour les données du graphique (l'axe des x = labels : temps et l'axe des y = datasets : altitude)
        this.chart.data.labels = this.altitudes.map(row => row.temps)
        this.chart.data.datasets[0].data = this.altitudes.map(row => row.alt)

        // Update le graphique
        this.chart.update()
    }

    // Update le texte de l'affichage de l'altitude
    updateValue(data) {
        document.getElementById(this.valueId).textContent = data.alt + " m"
    }

    // Update le component
    update(data) {
        this.updateChart(data)
        this.updateValue(data)
    }
}