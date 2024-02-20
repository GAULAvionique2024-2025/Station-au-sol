/**
 * Chart component (display altitude, speed and acceleration on a chart)
 * @module components/MyChart
 */

import ComponentClass from './componentClass.js';

export default class MyChart extends ComponentClass {
    // dataList = [{time:TIME, altitude:ALTITUDE, speed:SPEED, acceleration:ACCELERATION}]
    dataList = [];

    constructor({
        'altId': altId = 'alt',
        'speedId': speedId = "spd",
        'accId': accId = "acc",
        'chartId': chartId = 'chartjs',
        'maxData': maxData = 1000,
    } = {}) {
        super();
        // Link DOM elements
        this.alt = document.getElementById(altId);
        this.speed = document.getElementById(speedId);
        this.acc = document.getElementById(accId);
        this.chart = this.createChart(chartId);
        this.maxData = maxData;
    }

    // Create and configure the chart
    createChart(chartId = "chart") {
        const canvas = document.getElementById(chartId);
        const datasets = [];
        datasets.push({
            label: "ALT",
            data: this.dataList.map(row => row.altitude),
            // borderColor: 'rgba(255, 99, 132, 1)',
        });
        datasets.push({
            label: "SPD",
            data: this.dataList.map(row => row.speed),
            yAxisID: 'y1',
            // borderColor: 'rgba(54, 162, 235, 1)',
        });
        datasets.push({
            label: "ACC",
            data: this.dataList.map(row => row.acceleration),
            yAxisID: 'y1',
            // borderColor: 'rgba(255, 206, 86, 1)',
        });

        return new Chart(canvas, {
            type: 'line',
            data: {
                labels: this.dataList.map(row => row.time),
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
                // pointRadius: 2,
                pointRadius: 1,
                // pointHoverRadius: 3,
                pointHoverRadius: 2,
                borderWidth: 2,
                tension: 0.1, // 0: straight lines, 1: smooth curves
                scales: {
                    x: {
                        // type: 'time',
                        // display: true,
                        // time: {
                        //     unit: 'second',
                        // },
                        grid: {
                            drawOnChartArea: false, // hide grid lines
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        grid: {
                            drawOnChartArea: false, // hide grid lines
                        }
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

    // Add new data to the chart
    updateChart(data) {
        // Add data to the dataList
        this.dataList.push({ time: data.time, altitude: data.altitude, speed: data.speed, acceleration: data.acceleration });

        // Limit the number of data points
        this.dataListTruncated = this.dataList.slice(-this.maxData);

        // Update the data points (x axis = labels = time, and y axis = datasets = dataList)
        this.chart.data.labels = this.dataListTruncated.map(row => row.time);

        this.chart.data.datasets[0].data = this.dataListTruncated.map(row => row.altitude);
        this.chart.data.datasets[1].data = this.dataListTruncated.map(row => row.speed);
        this.chart.data.datasets[2].data = this.dataListTruncated.map(row => row.acceleration);

        // Update the chart
        this.chart.update();
    }

    // Update the text displaying the values
    updateValues(data) {
        this.alt.textContent = data.altitude;
        this.speed.textContent = data.speed;
        this.acc.textContent = data.acceleration;
    }

    // Update the component
    update(data) {
        this.updateChart(data);
        this.updateValues(data);
    }

    // Update the configuration
    setConfig(config) {
        this.maxData = ("maxData" in config.chart) ? config.chart.maxData : this.maxData;
    }

    // Reset the component
    reset() {
        this.alt.textContent = "0";
        this.speed.textContent = "0";
        this.acc.textContent = "0";
        this.dataList = [];
        this.chart.data.labels = [];
        this.chart.data.datasets[0].data = [];
        this.chart.data.datasets[1].data = [];
        this.chart.data.datasets[2].data = [];
        this.chart.update();
    }
}