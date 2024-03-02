// Variabel global untuk grafik
let chart1;
let chart2;
let chart3;

// Mengambil data alat dari API berdasarkan interval dan fields
async function fetchEquipmentData() {
    const headers = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const fetchUrl = `/api/equipment/`;

    try {
        const response = await fetch(fetchUrl, {
            method: "GET",
            cache: 'no-cache',
            headers: headers
        });
        const data = await response.json();
        const time = data.time;
        const data_v10 = data.value_v10;
        const data_v11 = data.value_v11;
        const data_v12 = data.value_v12;
        const data_v13 = data.value_v13;

        // Hide loading image
        document.getElementById('loading-chart-1').className = 'hidden';
        document.getElementById('loading-chart-2').className = 'hidden';
        document.getElementById('loading-chart-3').className = 'hidden';

        createChartV10andV11(time, data_v10, data_v11);
        createChartV12(time, data_v12);
        createChartV13(time, data_v13);

        return { time, data_v10, data_v11, data_v12, data_v13 };
    } catch (error) {
        console.error('Error fetching equipment data:', error);
        // Hide loading image even if there's an error
        document.getElementById('loading-chart-1').className = 'hidden';
        document.getElementById('loading-chart-2').className = 'hidden';
        document.getElementById('loading-chart-3').className = 'hidden';
        return null;
    }
}

// Membuat grafik untuk data alat v10 dan v11
function createChartV10andV11(time, data_v10, data_v11) {
    const config = {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: "PV - Sunny Tripower",
                    data: data_v10,
                    backgroundColor: "rgba(50, 69, 209,.6)",
                    borderColor: "rgba(63,82,227,1)",
                    fill: false
                }, {
                    label: "Battery - Sunny Island",
                    data: data_v11,
                    backgroundColor: "rgb(240, 184, 110)",
                    borderColor: "rgb(240, 184, 110)",
                    fill: false
                }
            ]
        },
        options: {
            maintainAspectRatio: false,
            animation: false,
            spanGaps: true,
            datasets: {
                line: {
                    pointRadius: 0
                }
            },
            tooltips: {
                mode: 'index',
                intersect: false
            },
            interaction: {
                intersect: false
            },
            plugins: {
                legend: {
                    align: 'end',
                    labels: {
                        usePointStyle: true
                    }
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: '⚡ Watt'
                    }
                },
                x: {
                    type: 'time',
                    ticks: {
                        major: {
                            enabled: true
                        },
                        font: (context) => {
                            const boldedTicks = context.tick && context.tick.major ? 'bold' : '';
                            return { weight: boldedTicks }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Waktu'
                    },
                }
            }
        }
    };

    if (chart1) chart1.destroy();
    chart1 = new Chart(document.getElementById('chart-1').getContext('2d'), config);

    for (const dateTimeString of time) {
        config.data.labels.push(new Date(dateTimeString).getTime() - timeZoneOffset)
    }

    // Update the chart
    chart1.update();

    document.querySelector("#p1_six_hours").addEventListener("click", function (e) {
        config.options.scales.x.min = sixHoursAgo
        chart1.update()
    });

    document.querySelector("#p1_twelve_hours").addEventListener("click", function (e) {
        config.options.scales.x.min = twelveHoursAgo
        chart1.update()
    });

    document.querySelector("#p1_one_day").addEventListener("click", function (e) {
        config.options.scales.x.min = twentyFourHoursAgo
        chart1.update()
    });

    document.querySelector("#p1_three_day").addEventListener("click", function (e) {
        config.options.scales.x.min = threeDaysAgo
        chart1.update()
    });

    document.querySelector("#p1_six_day").addEventListener("click", function (e) {
        config.options.scales.x.min = sixDaysAgo
        chart1.update()
    });

};

// Membuat grafik untuk data alat v12
function createChartV12(time, data_v12) {
    const config = {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: "Battery - Sunny Island",
                data: data_v12,
                backgroundColor: "rgb(240, 184, 110)",
                borderColor: "rgb(240, 184, 110)",
                fill: false
            }
            ]
        },
        options: {
            maintainAspectRatio: false,
            animation: false,
            spanGaps: true,
            datasets: {
                line: {
                    pointRadius: 0
                }
            },
            tooltips: {
                mode: 'index',
                intersect: false
            },
            interaction: {
                intersect: false
            },
            plugins: {
                legend: {
                    align: 'end',
                    labels: {
                        usePointStyle: true
                    }
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: '⚡ Watt'
                    }
                },
                x: {
                    type: 'time',
                    ticks: {
                        major: {
                            enabled: true
                        },
                        font: (context) => {
                            const boldedTicks = context.tick && context.tick.major ? 'bold' : '';
                            return { weight: boldedTicks }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Waktu'
                    },
                }
            }
        }
    };

    if (chart2) chart2.destroy();
    chart2 = new Chart(document.getElementById('chart-2').getContext('2d'), config);


    for (const dateTimeString of time) {
        config.data.labels.push(new Date(dateTimeString).getTime() - timeZoneOffset)
    }

    // Update the chart
    chart2.update();

    document.querySelector("#p2_six_hours").addEventListener("click", function (e) {
        config.options.scales.x.min = sixHoursAgo
        chart2.update()
    });

    document.querySelector("#p2_twelve_hours").addEventListener("click", function (e) {
        config.options.scales.x.min = twelveHoursAgo
        chart2.update()
    });

    document.querySelector("#p2_one_day").addEventListener("click", function (e) {
        config.options.scales.x.min = twentyFourHoursAgo
        chart2.update()
    });

    document.querySelector("#p2_three_day").addEventListener("click", function (e) {
        config.options.scales.x.min = threeDaysAgo
        chart2.update()
    });

    document.querySelector("#p2_six_day").addEventListener("click", function (e) {
        config.options.scales.x.min = sixDaysAgo
        chart2.update()
    });
};


// Membuat grafik untuk data alat v13
function createChartV13(time, data_v13) {
    const config = {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: "PV - Sunny Boy",
                data: data_v13,
                backgroundColor: "rgb(215, 19, 19)",
                borderColor: "rgb(215, 19, 19)",
                fill: false
            }
            ]
        },
        options: {
            maintainAspectRatio: false,
            animation: false,
            spanGaps: true,
            datasets: {
                line: {
                    pointRadius: 0
                }
            },
            tooltips: {
                mode: 'index',
                intersect: false
            },
            interaction: {
                intersect: false
            },
            plugins: {
                legend: {
                    align: 'end',
                    labels: {
                        usePointStyle: true
                    }
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: '⚡ Watt'
                    }
                },
                x: {
                    type: 'time',
                    ticks: {
                        major: {
                            enabled: true
                        },
                        font: (context) => {
                            const boldedTicks = context.tick && context.tick.major ? 'bold' : '';
                            return { weight: boldedTicks }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Waktu'
                    },
                }
            }
        }
    };

    if (chart3) chart3.destroy();
    chart3 = new Chart(document.getElementById('chart-3').getContext('2d'), config);


    for (const dateTimeString of time) {
        config.data.labels.push(new Date(dateTimeString).getTime() - timeZoneOffset)
    }

    // Update the chart
    chart3.update();

    document.querySelector("#p3_six_hours").addEventListener("click", function (e) {
        config.options.scales.x.min = sixHoursAgo
        chart3.update()
    });

    document.querySelector("#p3_twelve_hours").addEventListener("click", function (e) {
        config.options.scales.x.min = twelveHoursAgo
        chart3.update()
    });

    document.querySelector("#p3_one_day").addEventListener("click", function (e) {
        config.options.scales.x.min = twentyFourHoursAgo
        chart3.update()
    });

    document.querySelector("#p3_three_day").addEventListener("click", function (e) {
        config.options.scales.x.min = threeDaysAgo
        chart3.update()
    });

    document.querySelector("#p3_six_day").addEventListener("click", function (e) {
        config.options.scales.x.min = sixDaysAgo
        chart3.update()
    });

};

// Mengambil data awal dan menampilkan grafik
fetchEquipmentData()