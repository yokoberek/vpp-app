const options = {
    day: "numeric",
    month: "short",
    year: "numeric"
};

// Calculate date values
const timeZoneOffset = 7 * 60 * 60 * 1000; // Offset untuk GMT+7 dalam milidetik
const currentTime = new Date(); // Waktu saat ini
const sixHoursAgo = new Date(currentTime - 6 * 60 * 60 * 1000); // Waktu 6 jam lalu
const twelveHoursAgo = new Date(currentTime - 12 * 60 * 60 * 1000); // Waktu 12 jam lalu
const twentyFourHoursAgo = new Date(currentTime - 24 * 60 * 60 * 1000); // Waktu 24 jam lalu
const threeDaysAgo = new Date(currentTime - 3 * 24 * 60 * 60 * 1000); // Waktu 3 hari lalu
const sixDaysAgo = new Date(currentTime - 6 * 24 * 60 * 60 * 1000); // Waktu 6 hari lalu


// Fetch API data and create charts
function fetchAndCreateCharts() {
    const headers = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    fetch("/api/equipment", {
        method: "GET",
        headers: headers
    }).then(response => response.json()).then(data => {
        const time = data.time;
        const data_v10 = data.value_v10;
        const data_v11 = data.value_v11;
        const data_v12 = data.value_v12;
        const data_v13 = data.value_v13;

        createChartV10andV11(time, data_v10, data_v11);
        createChartV12(time, data_v12)
        createChartV13(time, data_v13)
    });

    fetch("/api/billing", {
        method: "GET",
        headers: headers
    }).then(response => response.json()).then(data => {
        const time = data.time;
        const bill_vpp1 = data.bill_vpp1;
        const bill_vpp2 = data.bill_vpp2;
        const bill_vpp3 = data.bill_vpp3;

        createChartBill(time, bill_vpp1, bill_vpp2, bill_vpp3);
    });
}

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
                    backgroundColor: "rgba(253, 183, 90,.6)",
                    borderColor: "rgba(253, 183, 90,.6)",
                    fill: false
                }
            ]
        },
        options: {
            maintainAspectRatio: false,
            tooltips: {
                mode: 'index',
                intersect: false
            },
            interaction: {
                intersect: false
            },
            plugins: {
                legend: {
                    align: 'center'
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
                            return {weight: boldedTicks}
                        }
                    },
                    title: {
                        display: true,
                        text: 'Waktu'
                    },
                    min: new Date(twentyFourHoursAgo).getTime() + timeZoneOffset
                }
            }
        }
    };

    const chart = new Chart(document.getElementById('chart-1').getContext('2d'), config);


    for (const dateTimeString of time) {
        config.data.labels.push(new Date(dateTimeString).getTime() - timeZoneOffset)
    }

    // Update the chart
    chart.update();

    document.querySelector("#p1_six_hours").addEventListener("click", function (e) {
        config.options.scales.x.min = sixHoursAgo
        chart.update()
    });

    document.querySelector("#p1_twelve_hours").addEventListener("click", function (e) {
        config.options.scales.x.min = twelveHoursAgo
        chart.update()
    });

    document.querySelector("#p1_one_day").addEventListener("click", function (e) {
        config.options.scales.x.min = twentyFourHoursAgo
        chart.update()
    });

    document.querySelector("#p1_three_day").addEventListener("click", function (e) {
        config.options.scales.x.min = threeDaysAgo
        chart.update()
    });

    document.querySelector("#p1_six_day").addEventListener("click", function (e) {
        config.options.scales.x.min = sixDaysAgo
        chart.update()
    });

};

function createChartV12(time, data_v12) {
    const config = {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                    label: "Battery - Sunny Island",
                    data: data_v12,
                    backgroundColor: "rgba(253, 183, 90,.6)",
                    borderColor: "rgba(253, 183, 90,.6)",
                    fill: false
                }
            ]
        },
        options: {
            maintainAspectRatio: false,
            tooltips: {
                mode: 'index',
                intersect: false
            },
            interaction: {
                intersect: false
            },
            plugins: {
                legend: {
                    align: 'center'
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
                            return {weight: boldedTicks}
                        }
                    },
                    title: {
                        display: true,
                        text: 'Waktu'
                    },
                    min: new Date(twentyFourHoursAgo).getTime() + timeZoneOffset
                }
            }
        }
    };

    const chart = new Chart(document.getElementById('chart-2').getContext('2d'), config);


    for (const dateTimeString of time) {
        config.data.labels.push(new Date(dateTimeString).getTime() - timeZoneOffset)
    }

    // Update the chart
    chart.update();

    document.querySelector("#p2_six_hours").addEventListener("click", function (e) {
        config.options.scales.x.min = sixHoursAgo
        chart.update()
    });

    document.querySelector("#p2_twelve_hours").addEventListener("click", function (e) {
        config.options.scales.x.min = twelveHoursAgo
        chart.update()
    });

    document.querySelector("#p2_one_day").addEventListener("click", function (e) {
        config.options.scales.x.min = twentyFourHoursAgo
        chart.update()
    });

    document.querySelector("#p2_three_day").addEventListener("click", function (e) {
        config.options.scales.x.min = threeDaysAgo
        chart.update()
    });

    document.querySelector("#p2_six_day").addEventListener("click", function (e) {
        config.options.scales.x.min = sixDaysAgo
        chart.update()
    });

};

function createChartV13(time, data_v13) {
    const config = {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                    label: "Battery - Sunny Island",
                    data: data_v13,
                    backgroundColor: "rgba(253, 183, 90,.6)",
                    borderColor: "rgba(253, 183, 90,.6)",
                    fill: false
                }
            ]
        },
        options: {
            maintainAspectRatio: false,
            tooltips: {
                mode: 'index',
                intersect: false
            },
            interaction: {
                intersect: false
            },
            plugins: {
                legend: {
                    align: 'center'
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
                            return {weight: boldedTicks}
                        }
                    },
                    title: {
                        display: true,
                        text: 'Waktu'
                    },
                    min: new Date(twentyFourHoursAgo).getTime() + timeZoneOffset
                }
            }
        }
    };

    const chart = new Chart(document.getElementById('chart-3').getContext('2d'), config);


    for (const dateTimeString of time) {
        config.data.labels.push(new Date(dateTimeString).getTime() - timeZoneOffset)
    }

    // Update the chart
    chart.update();

    document.querySelector("#p3_six_hours").addEventListener("click", function (e) {
        config.options.scales.x.min = sixHoursAgo
        chart.update()
    });

    document.querySelector("#p3_twelve_hours").addEventListener("click", function (e) {
        config.options.scales.x.min = twelveHoursAgo
        chart.update()
    });

    document.querySelector("#p3_one_day").addEventListener("click", function (e) {
        config.options.scales.x.min = twentyFourHoursAgo
        chart.update()
    });

    document.querySelector("#p3_three_day").addEventListener("click", function (e) {
        config.options.scales.x.min = threeDaysAgo
        chart.update()
    });

    document.querySelector("#p3_six_day").addEventListener("click", function (e) {
        config.options.scales.x.min = sixDaysAgo
        chart.update()
    });

};

function createChartBill(time, bill_vpp1, bill_vpp2, bill_vpp3) {
    const config = {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: "BILL - VPP 1",
                    data: bill_vpp1,
                    backgroundColor: "rgba(50, 69, 209,.6)",
                    borderColor: "rgba(63,82,227,1)",
                    fill: false
                }, {
                    label: "BILL - BPP 2",
                    data: bill_vpp2,
                    backgroundColor: "rgba(253, 183, 90,.6)",
                    borderColor: "rgba(253, 183, 90,.6)",
                    fill: false
                }, {
                    label: "BILL - BPP 3",
                    data: bill_vpp3,
                    backgroundColor: "rgba(153, 102, 255, 0.2)",
                    borderColor: "rgba(153, 102, 255, 0.2)",
                    fill: false
                }
            ]
        },
        options: {
            maintainAspectRatio: false,
            tooltips: {
                mode: 'index',
                intersect: false
            },
            interaction: {
                intersect: false
            },
            plugins: {
                legend: {
                    align: 'center'
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Savings'
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
                            return {weight: boldedTicks}
                        }
                    },
                    title: {
                        display: true,
                        text: 'Waktu'
                    },
                    min: new Date(twentyFourHoursAgo).getTime() + timeZoneOffset
                }
            }
        }
    };

    const chart = new Chart(document.getElementById('chart-4').getContext('2d'), config);


    for (const dateTimeString of time) {
        config.data.labels.push(new Date(dateTimeString).getTime() - timeZoneOffset)
    }

    // Update the chart
    chart.update();

    document.querySelector("#p4_six_hours").addEventListener("click", function (e) {
        config.options.scales.x.min = sixHoursAgo
        chart.update()
    });

    document.querySelector("#p4_twelve_hours").addEventListener("click", function (e) {
        config.options.scales.x.min = twelveHoursAgo
        chart.update()
    });

    document.querySelector("#p4_one_day").addEventListener("click", function (e) {
        config.options.scales.x.min = twentyFourHoursAgo
        chart.update()
    });

    document.querySelector("#p4_three_day").addEventListener("click", function (e) {
        config.options.scales.x.min = threeDaysAgo
        chart.update()
    });

    document.querySelector("#p4_six_day").addEventListener("click", function (e) {
        config.options.scales.x.min = sixDaysAgo
        chart.update()
    });

};

// Fetch data and create charts on page load
fetchAndCreateCharts();
