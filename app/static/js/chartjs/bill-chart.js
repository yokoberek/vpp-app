// Variabel global untuk grafik
let bill_chart;

// Mengambil data tagihan dari API berdasarkan interval
async function fetchBillingData() {
    const headers = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const fetchUrl = `/api/billing/`;

    try {
        const response = await fetch(fetchUrl, {
            method: "GET",
            cache: 'no-cache',
            headers: headers
        });
        const data = await response.json();
        const { bill_date, ...bill_vpps } = data;
        // const bill_date = data.bill_date;
        // const bill_vpp1 = data.bill_vpp1;
        // const bill_vpp2 = data.bill_vpp2;
        // const bill_vpp3 = data.bill_vpp3;
        // const bill_vpp4 = data.bill_vpp4;
        // const bill_vpp5 = data.bill_vpp5;
        // const bill_vpp6 = data.bill_vpp6;
        // const bill_vpp7 = data.bill_vpp7;
        // const bill_vpp8 = data.bill_vpp8;
        // const bill_vpp9 = data.bill_vpp9;
        // const bill_vpp10 = data.bill_vpp10;
        // const bill_vpp11 = data.bill_vpp11;
        // const bill_vpp12 = data.bill_vpp12;
        // const bill_vpp13 = data.bill_vpp13;
        // const bill_vpp14 = data.bill_vpp13;

        // Hide loading image
        document.getElementById('loading-bill-chart').className = 'hidden';

        // createChartBill(bill_date, bill_vpp1, bill_vpp2, bill_vpp3, bill_vpp4, bill_vpp5, bill_vpp6, bill_vpp7, bill_vpp8, bill_vpp9, bill_vpp10, bill_vpp11, bill_vpp12, bill_vpp13, bill_vpp14);
        createChartBill(bill_date, Object.values(bill_vpps));

        return {};
        return {}
    } catch (error) {
        console.error('Error fetching billing data:', error);
        // Hide loading image even if there's an error
        document.getElementById('loading-bill-chart').className = 'hidden';
        return null;
    }
}

// Membuat grafik untuk data tagihan
function createChartBill(bill_date, bill_vpps) {
    const datasets = bill_vpps.map((vpp, index) => {
        // Generate random colors
        const backgroundColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.6)`;
        const borderColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 1)`;

        return {
            label: `BILL - VPP ${index + 1}`,
            data: vpp,
            backgroundColor,
            borderColor,
            fill: false
        };
    });

    const config = {
        type: 'line',
        data: {
            labels: [],
            datasets: datasets

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

    if (bill_chart) bill_chart.destroy()
    bill_chart = new Chart(document.getElementById('bill-chart').getContext('2d'), config);


    for (const dateTimeString of bill_date) {
        config.data.labels.push(new Date(dateTimeString).getTime() - timeZoneOffset)
    }

    // Update the chart
    bill_chart.update();

    document.querySelector("#bill_six_hours").addEventListener("click", function (e) {
        config.options.scales.x.min = sixHoursAgo
        bill_chart.update()
    });

    document.querySelector("#bill_twelve_hours").addEventListener("click", function (e) {
        config.options.scales.x.min = twelveHoursAgo
        bill_chart.update()
    });

    document.querySelector("#bill_one_day").addEventListener("click", function (e) {
        config.options.scales.x.min = twentyFourHoursAgo
        bill_chart.update()
    });

    document.querySelector("#bill_three_day").addEventListener("click", function (e) {
        config.options.scales.x.min = threeDaysAgo
        bill_chart.update()
    });

    document.querySelector("#bill_six_day").addEventListener("click", function (e) {
        config.options.scales.x.min = sixDaysAgo
        bill_chart.update()
    });

};


// Mengambil data awal dan menampilkan grafik
fetchBillingData()