export const ChartConfig = {
    type: 'line',
    data: {
        labels: [],
        datasets: [{ label: 'ALT', }, { label: 'SPD', }, { label: 'ACC', }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        animation: false,
        pointRadius: 1,
        pointHoverRadius: 2,
        borderWidth: 2,
        tension: 0.1, // 0: straight lines, 1: smooth curves
        scales: {
            x: {
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
                    drawOnChartArea: false, // hide grid lines
                },
            },
        },
    },
}