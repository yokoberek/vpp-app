// Menghitung nilai-nilai tanggal dan offset zona waktu
const timeZoneOffset = 7 * 60 * 60 * 1000; // Offset untuk GMT+7 dalam milidetik
const currentTime = new Date(); // Waktu saat ini
const sixHoursAgo = new Date(currentTime - 6 * 60 * 60 * 1000); // Waktu 6 jam yang lalu
const twelveHoursAgo = new Date(currentTime - 12 * 60 * 60 * 1000); // Waktu 12 jam yang lalu
const twentyFourHoursAgo = new Date(currentTime - 24 * 60 * 60 * 1000); // Waktu 24 jam yang lalu
const threeDaysAgo = new Date(currentTime - 3 * 24 * 60 * 60 * 1000); // Waktu 3 hari yang lalu
const sixDaysAgo = new Date(currentTime - 6 * 24 * 60 * 60 * 1000); // Waktu 6 hari yang lalu


// Variabel global untuk grafik
let chart1;
let chart2;
let chart3;
let chart4;

// Mengambil data alat dari API berdasarkan interval dan fields
async function fetchEquipmentData(fields, interval_type, interval_value) {
    const headers = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    // const fetchUrl = `/api/equipment/?interval_type=${interval_type}&interval_value=${interval_value}`;
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

        if (fields.includes('v10')) {
            createChartV10andV11(time, data_v10, data_v11);
        } else if (fields.includes('v12')) {
            createChartV12(time, data_v12);
        } else if (fields.includes('v13')) {
            createChartV13(time, data_v13);
        } else {
            createChartV10andV11(time, data_v10, data_v11);
            createChartV12(time, data_v12);
            createChartV13(time, data_v13);
        }

        return { time, data_v10, data_v11, data_v12, data_v13 };
    } catch (error) {
        console.error('Error fetching equipment data:', error);
        return null;
    }
}

// Mengambil data tagihan dari API berdasarkan interval
async function fetchBillingData(interval_type, interval_value) {
    const headers = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const fetchUrl = `/api/billing/?interval_type=${interval_type}&interval_value=${interval_value}`;

    try {
        const response = await fetch(fetchUrl, {
            method: "GET",
            cache: 'no-cache',
            headers: headers
        });
        const data = await response.json();
        const time = data.time;
        const bill_vpp1 = data.bill_vpp1;
        const bill_vpp2 = data.bill_vpp2;
        const bill_vpp3 = data.bill_vpp3;

        createChartBill(time, bill_vpp1, bill_vpp2, bill_vpp3);

        return { time, bill_vpp1, bill_vpp2, bill_vpp3 };
    } catch (error) {
        console.error('Error fetching billing data:', error);
        return null;
    }
}

// Mengambil data berdasarkan filter dan jenis
async function fetchDataWithFilter(fields = [], type = null, interval_type = 'HOUR', interval_value = 6) {
    if (type === 'equipment') {
        return await fetchEquipmentData(fields, interval_type, interval_value);
    } else if (type === 'billing') {
        return await fetchBillingData(interval_type, interval_value);
    } else {
        const equipmentData = await fetchEquipmentData(fields, interval_type, interval_value);
        const billingData = await fetchBillingData(interval_type, interval_value);

        if (equipmentData && billingData) {
            return { ...equipmentData, ...billingData };
        } else {
            return null;
        }
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
        const intervalValue = 3;
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
        const intervalType = 'DAY';
        const intervalValue = 6;
        fetchDataWithFilter(fields, filterType, intervalType, intervalValue);
    });

};

// Membuat grafik untuk data tagihan
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
                    align: 'end',
                    labels: {
                        usePointStyle: true,
                    },
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: '💲 Savings'
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

// Mengambil data awal dan menampilkan grafik
fetchDataWithFilter()