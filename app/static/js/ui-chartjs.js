// Plot 1 Configuration
document.addEventListener('DOMContentLoaded', function () {
    const config = {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: "PV - Sunny Tripower",
                data: [],
                backgroundColor: "rgba(50, 69, 209,.6)",
                borderColor: "rgba(63,82,227,1)",
                fill: false,
            },
                {
                    label: "Battery - Sunny Island",
                    data: [],
                    backgroundColor: "rgba(253, 183, 90,.6)",
                    borderColor: "rgba(253, 183, 90,.6)",
                    fill: false,
                }],
        },
        options: {
            maintainAspectRatio: false,
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: '⚡ Watt'
                    }
                },
                x: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Waktu'
                    }
                }
            }
        }
    };

    const context = document.getElementById('chart-1').getContext('2d');

    const lineChart = new Chart(context, config);

    const source = new EventSource("/data-streaming/vpp1");

    source.onmessage = function (event) {
        const data = JSON.parse(event.data);

        if (config.data.labels.length === 10) {
            config.data.labels.shift();
            config.data.datasets[0].data.shift();
            config.data.datasets[1].data.shift();
        }

        // Add the new data point at the end of the arrays
        config.data.labels.push(data.time);
        config.data.datasets[0].data.push(data.value_v10);
        config.data.datasets[1].data.push(data.value_v11);

        // Update the chart
        lineChart.update();

    };
});

// Plot 2 Configurtion
document.addEventListener('DOMContentLoaded', function () {
    const config = {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: "Battery - Sunny Island",
                data: [],
                backgroundColor: 'rgb(65, 145, 250)',
                borderColor: 'rgb(65, 145, 250)',
                fill: false,
            }],
        },
        options: {
            maintainAspectRatio: false,
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: '⚡ Watt'
                    }
                },
                x: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Waktu'
                    }
                }
            }
        }
    };

    const context = document.getElementById('chart-2').getContext('2d');

    const lineChart = new Chart(context, config);

    const source = new EventSource("/data-streaming/vpp2");

    source.onmessage = function (event) {
        const data = JSON.parse(event.data);

        if (config.data.labels.length === 10) {
            config.data.labels.shift();
            config.data.datasets[0].data.shift();
        }

        // Add the new data point at the end of the arrays
        config.data.labels.push(data.time);
        config.data.datasets[0].data.push(data.value_v12);

        // Update the chart
        lineChart.update();
    };
});

// Plot 3 Configurtion
document.addEventListener('DOMContentLoaded', function () {
    const config = {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: "PV - Sunny Boy",
                data: [],
                backgroundColor: 'rgb(65, 145, 250)',
                borderColor: 'rgb(65, 145, 250)',
                fill: false,
            }],
        },
        options: {
            maintainAspectRatio: false,
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: '⚡ Watt'
                    }
                },
                x: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Waktu'
                    }
                }
            }
        }
    };

    const context = document.getElementById('chart-3').getContext('2d');

    const lineChart = new Chart(context, config);

    const source = new EventSource("/data-streaming/vpp3");

    source.onmessage = function (event) {
        const data = JSON.parse(event.data);

        if (config.data.labels.length === 10) {
            config.data.labels.shift();
            config.data.datasets[0].data.shift();
        }

        // Add the new data point at the end of the arrays
        config.data.labels.push(data.time);
        config.data.datasets[0].data.push(data.value_v13);

        // Update the chart
        lineChart.update();
    };
});

// Plot 4 Configurtion
document.addEventListener('DOMContentLoaded', function () {
    const config = {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: "BILL - VPP 1",
                data: [],
                backgroundColor: "rgba(50, 69, 209,.6)",
                borderColor: "rgba(63,82,227,1)",
                fill: false,
            },
                {
                    label: "BILL - VPP 2",
                    data: [],
                    backgroundColor: "rgba(253, 183, 90,.6)",
                    borderColor: "rgba(253, 183, 90,.6)",
                    fill: false,
                },
            {
                    label: "BILL - VPP 3",
                    data: [],
                    backgroundColor: "rgb(75, 192, 192)",
                    borderColor: "rgb(75, 192, 192)",
                    fill: false,
                }],
        },
        options: {
            maintainAspectRatio: false,
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Billing'
                    }
                },
                x: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Waktu'
                    }
                }
            }
        }
    };

    const context = document.getElementById('chart-4').getContext('2d');

    const lineChart = new Chart(context, config);

    const source = new EventSource("/data-streaming/billing");

    source.onmessage = function (event) {
        const data = JSON.parse(event.data);

        if (config.data.labels.length === 10) {
            config.data.labels.shift();
            config.data.datasets[0].data.shift();
            config.data.datasets[1].data.shift();
            config.data.datasets[2].data.shift();
        }

        // Add the new data point at the end of the arrays
        config.data.labels.push(data.time);
        config.data.datasets[0].data.push(data.bill_vpp1);
        config.data.datasets[1].data.push(data.bill_vpp2);
        config.data.datasets[2].data.push(data.bill_vpp3);

        // Update the chart
        lineChart.update();

    };
});