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

// Global variable for chart
let chart1;
let chart2;
let chart3;
let chart4;

// Fetch API data and create charts

function fetchDataWithFilter(fields = [], type = null, interval_type = 'HOUR', interval_value = 6) {
    const headers = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (type == 'equipment') {
        if (fields.includes('v10')) {
            fetch(`/api/equipment/?interval_type=${interval_type}&interval_value=${interval_value}&type=${type}&fields=${fields[0]},${fields[1]}`, {
                method: "GET",
                cache: 'no-cache',
                headers: headers
            }).then(response => response.json()).then(data => {
                const time = data.time;
                const data_v10 = data.value_v10;
                const data_v11 = data.value_v11;
                createChartV10andV11(time, data_v10, data_v11);
            });
        } else if (fields.includes('v12')) {
            fetch(`/api/equipment/?interval_type=${interval_type}&interval_value=${interval_value}&type=${type}&fields=${fields[0]}`, {
                method: "GET",
                cache: 'no-cache',
                headers: headers
            }).then(response => response.json()).then(data => {
                const time = data.time;
                const data_v12 = data.value_v12;
                createChartV12(time, data_v12)
            });
        } else if (fields.includes('v13')) {
            fetch(`/api/equipment/?interval_type=${interval_type}&interval_value=${interval_value}&type=${type}&fields=${fields[0]}`, {
                method: "GET",
                cache: 'no-cache',
                headers: headers
            }).then(response => response.json()).then(data => {
                const time = data.time;
                const data_v13 = data.value_v13;
                createChartV13(time, data_v13)
            });
        } else {
            fetch(`/api/equipment/?interval_type=${interval_type}&interval_value=${interval_value}&type=${type}`, {
                method: "GET",
                cache: 'no-cache',
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
        }

    } else if (type == 'billing') {
        fetch(`/api/billing/?interval_type=${interval_type}&interval_value=${interval_value}&type=${type}`, {
            method: "GET",
            cache: 'no-cache',
            headers: headers
        }).then(response => response.json()).then(data => {
            const time = data.time;
            const bill_vpp1 = data.bill_vpp1;
            const bill_vpp2 = data.bill_vpp2;
            const bill_vpp3 = data.bill_vpp3;

            createChartBill(time, bill_vpp1, bill_vpp2, bill_vpp3);
        });
    } else {
        fetch(`/api/equipment/?interval_type=${interval_type}&interval_value=${interval_value}`, {
            method: "GET",
            cache: 'no-cache',
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

        fetch(`/api/billing/?interval_type=${interval_type}&interval_value=${interval_value}`, {
            method: "GET",
            cache: 'no-cache',
            headers: headers
        }).then(response => response.json()).then(data => {
            const time = data.time;
            const bill_vpp1 = data.bill_vpp1;
            const bill_vpp2 = data.bill_vpp2;
            const bill_vpp3 = data.bill_vpp3;

            createChartBill(time, bill_vpp1, bill_vpp2, bill_vpp3);
        });
    }
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

    const fields = ['v10', 'v11']

    document.querySelector("#p1_six_hours").addEventListener("click", function (e) {
        config.options.scales.x.min = sixHoursAgo
        chart1.update()

        const filterType = 'equipment';
        const intervalType = 'HOUR';
        const intervalValue = 6;
        fetchDataWithFilter(fields, filterType, intervalType, intervalValue);
    });

    document.querySelector("#p1_twelve_hours").addEventListener("click", function (e) {
        config.options.scales.x.min = twelveHoursAgo
        chart1.update()

        const filterType = 'equipment';
        const intervalType = 'HOUR';
        const intervalValue = 12;
        fetchDataWithFilter(fields, filterType, intervalType, intervalValue);
    });

    document.querySelector("#p1_one_day").addEventListener("click", function (e) {
        config.options.scales.x.min = twentyFourHoursAgo
        chart1.update()

        const filterType = 'equipment';
        const intervalType = 'HOUR';
        const intervalValue = 24;
        fetchDataWithFilter(fields, filterType, intervalType, intervalValue);
    });

    document.querySelector("#p1_three_day").addEventListener("click", function (e) {
        config.options.scales.x.min = threeDaysAgo
        chart1.update()

        const filterType = 'equipment';
        const intervalType = 'DAY';
        const intervalValue = 1;
        fetchDataWithFilter(fields, filterType, intervalType, intervalValue);
    });

    document.querySelector("#p1_six_day").addEventListener("click", function (e) {
        config.options.scales.x.min = sixDaysAgo
        chart1.update()

        const filterType = 'equipment';
        const intervalType = 'DAY';
        const intervalValue = 6;
        fetchDataWithFilter(fields, filterType, intervalType, intervalValue);
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

    const fields = ['v12']

    document.querySelector("#p2_six_hours").addEventListener("click", function (e) {
        config.options.scales.x.min = sixHoursAgo
        chart2.update()

        const filterType = 'equipment';
        const intervalType = 'HOUR';
        const intervalValue = 6;
        fetchDataWithFilter(fields, filterType, intervalType, intervalValue);
    });

    document.querySelector("#p2_twelve_hours").addEventListener("click", function (e) {
        config.options.scales.x.min = twelveHoursAgo
        chart2.update()

        const filterType = 'equipment';
        const intervalType = 'HOUR';
        const intervalValue = 12;
        fetchDataWithFilter(fields, filterType, intervalType, intervalValue);
    });

    document.querySelector("#p2_one_day").addEventListener("click", function (e) {
        config.options.scales.x.min = twentyFourHoursAgo
        chart2.update()

        const filterType = 'equipment';
        const intervalType = 'HOUR';
        const intervalValue = 24;
        fetchDataWithFilter(fields, filterType, intervalType, intervalValue);
    });

    document.querySelector("#p2_three_day").addEventListener("click", function (e) {
        config.options.scales.x.min = threeDaysAgo
        chart2.update()

        const filterType = 'equipment';
        const intervalType = 'DAY';
        const intervalValue = 3;
        fetchDataWithFilter(fields, filterType, intervalType, intervalValue);
    });

    document.querySelector("#p2_six_day").addEventListener("click", function (e) {
        config.options.scales.x.min = sixDaysAgo
        chart2.update()

        const filterType = 'equipment';
        const intervalType = 'DAY';
        const intervalValue = 6;
        fetchDataWithFilter(fields, filterType, intervalType, intervalValue);
    });

};

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
                }
            }
        }
    };

    if (chart3) chart3.destroy()
    chart3 = new Chart(document.getElementById('chart-3').getContext('2d'), config);


    for (const dateTimeString of time) {
        config.data.labels.push(new Date(dateTimeString).getTime() - timeZoneOffset)
    }

    // Update the chart
    chart3.update();

    const fields = ['v13']

    document.querySelector("#p3_six_hours").addEventListener("click", function (e) {
        config.options.scales.x.min = sixHoursAgo
        chart3.update()

        const filterType = 'equipment';
        const intervalType = 'HOUR';
        const intervalValue = 6;
        fetchDataWithFilter(fields, filterType, intervalType, intervalValue);
    });

    document.querySelector("#p3_twelve_hours").addEventListener("click", function (e) {
        config.options.scales.x.min = twelveHoursAgo
        chart3.update()

        const filterType = 'equipment';
        const intervalType = 'HOUR';
        const intervalValue = 12;
        fetchDataWithFilter(fields, filterType, intervalType, intervalValue);
    });

    document.querySelector("#p3_one_day").addEventListener("click", function (e) {
        config.options.scales.x.min = twentyFourHoursAgo
        chart3.update()

        const filterType = 'equipment';
        const intervalType = 'HOUR';
        const intervalValue = 24;
        fetchDataWithFilter(fields, filterType, intervalType, intervalValue);
    });

    document.querySelector("#p3_three_day").addEventListener("click", function (e) {
        config.options.scales.x.min = threeDaysAgo
        chart3.update()

        const filterType = 'equipment';
        const intervalType = 'DAY';
        const intervalValue = 3;
        fetchDataWithFilter(fields, filterType, intervalType, intervalValue);
    });

    document.querySelector("#p3_six_day").addEventListener("click", function (e) {
        config.options.scales.x.min = sixDaysAgo
        chart3.update()

        const filterType = 'equipment';
        const intervalType = 'HOUR';
        const intervalValue = 6;
        fetchDataWithFilter(fields, filterType, intervalType, intervalValue);
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
                    backgroundColor: "rgb(240, 184, 110)",
                    borderColor: "rgb(240, 184, 110)",
                    fill: false
                }, {
                    label: "BILL - BPP 3",
                    data: bill_vpp3,
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
                }
            }
        }
    };

    if (chart4) chart4.destroy()
    chart4 = new Chart(document.getElementById('chart-4').getContext('2d'), config);


    for (const dateTimeString of time) {
        config.data.labels.push(new Date(dateTimeString).getTime() - timeZoneOffset)
    }

    // Update the chart
    chart4.update();

    document.querySelector("#p4_six_hours").addEventListener("click", function (e) {
        config.options.scales.x.min = sixHoursAgo
        chart4.update()

        const filterType = 'billing';
        const intervalType = 'HOUR';
        const intervalValue = 6;
        fetchDataWithFilter(null, filterType, intervalType, intervalValue);
    });

    document.querySelector("#p4_twelve_hours").addEventListener("click", function (e) {
        config.options.scales.x.min = twelveHoursAgo
        chart4.update()

        const filterType = 'billing';
        const intervalType = 'HOUR';
        const intervalValue = 12;
        fetchDataWithFilter(null, filterType, intervalType, intervalValue);
    });

    document.querySelector("#p4_one_day").addEventListener("click", function (e) {
        config.options.scales.x.min = twentyFourHoursAgo
        chart4.update()

        const filterType = 'billing';
        const intervalType = 'HOUR';
        const intervalValue = 24;
        fetchDataWithFilter(null, filterType, intervalType, intervalValue);
    });

    document.querySelector("#p4_three_day").addEventListener("click", function (e) {
        config.options.scales.x.min = threeDaysAgo
        chart4.update()

        const filterType = 'billing';
        const intervalType = 'DAY';
        const intervalValue = 3;
        fetchDataWithFilter(null, filterType, intervalType, intervalValue);
    });

    document.querySelector("#p4_six_day").addEventListener("click", function (e) {
        config.options.scales.x.min = sixDaysAgo
        chart4.update()

        const filterType = 'billing';
        const intervalType = 'DAY';
        const intervalValue = 6;
        fetchDataWithFilter(null, filterType, intervalType, intervalValue);
    });

};


// Fetch data and create charts on page load
fetchDataWithFilter();