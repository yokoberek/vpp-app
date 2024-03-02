// NOT USED ApexChartJS, IN APPLICATIONS USING ChartJS

// Menghitung nilai-nilai tanggal dan offset zona waktu
// const timeZoneOffset = 7 * 60 * 60 * 1000; // Offset untuk GMT+7 dalam milidetik
// const currentTime = new Date(); // Waktu saat ini
// const sixHoursAgo = new Date(currentTime - 6 * 60 * 60 * 1000); // Waktu 6 jam yang lalu
// const twelveHoursAgo = new Date(currentTime - 12 * 60 * 60 * 1000); // Waktu 12 jam yang lalu
// const twentyFourHoursAgo = new Date(currentTime - 24 * 60 * 60 * 1000); // Waktu 24 jam yang lalu
// const threeDaysAgo = new Date(currentTime - 3 * 24 * 60 * 60 * 1000); // Waktu 3 hari yang lalu
// const sixDaysAgo = new Date(currentTime - 6 * 24 * 60 * 60 * 1000); // Waktu 6 hari yang lalu


// Fetch API data and create charts
function fetchAndCreateCharts() {
    const headers = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    fetch("/api/equipment/", {
        method: "GET",
        headers: headers
    }).then(response => response.json()).then(data => {
        const data_v10 = data['data_v10'];
        const data_v11 = data['data_v11'];
        const data_v12 = data['data_v12'];
        const data_v13 = data['data_v13'];

        console.info(data_v10)

        createChartV10andV11(data_v10, data_v11);
        // createChartV12(data_v12);
        // createChartV13(data_v13);
    });

    // fetch("/api/bill", {
    //     method: "GET",
    //     headers: headers
    // }).then(response => response.json()).then(data => {
    //     const bill_vpp1 = data['bill_vpp1'];
    //     const bill_vpp2 = data['bill_vpp2'];
    //     const bill_vpp3 = data['bill_vpp3'];

    //     createChartBill(bill_vpp1, bill_vpp2, bill_vpp3);
    // });
}

async function fetchAndCreateCharts() {
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
        // const data_v12 = data.value_v12;
        // const data_v13 = data.value_v13;

        // Hide loading image
        // document.getElementById('loading-chart-1').className = 'hidden';
        // document.getElementById('loading-chart-2').className = 'hidden';
        // document.getElementById('loading-chart-3').className = 'hidden';
        // document.getElementById('loading-chart-4').className = 'hidden';

        createChartV10andV11_V2(time, data_v10, data_v11);
        // createChartV12(time, data_v12);
        // createChartV13(time, data_v13);

        // return { time, data_v10, data_v11, data_v12, data_v13 };
        return { time, data_v10, data_v11 };
    } catch (error) {
        console.error('Error fetching equipment data:', error);
        // Hide loading image even if there's an error
        // document.getElementById('loading-chart-1').className = 'hidden';
        // document.getElementById('loading-chart-2').className = 'hidden';
        // document.getElementById('loading-chart-3').className = 'hidden';
        // document.getElementById('loading-chart-4').className = 'hidden';
        return null;
    }
}

function createChartV10andV11_V2(time, data_v10, data_v11) {
    var seriesDataV10 = time.map((timeStr, index) => ({
        x: new Date(timeStr).getTime() - timeZoneOffset,
        y: data_v10[index]
    }));

    var seriesDataV11 = time.map((timeStr, index) => ({
        x: new Date(timeStr).getTime() - timeZoneOffset,
        y: data_v11[index]
    }));

    let options = {
        series: [
            {
                name: "PV - Sunny Tripower",
                data: seriesDataV10,
                color: "#008FFB"
            },
            {
                name: "Battery - Sunny Island",
                data: seriesDataV11,
                color: "#00E396"
            }
        ],
        xaxis: {
            type: "datetime",
            min: new Date(twentyFourHoursAgo).getTime() + timeZoneOffset,
            datetimeUTC: false,
            labels: {
                show: true,
                offsetY: -5,
                offsetX: 15,
                style: {
                    fontFamily: "Inter, sans-serif",
                    cssClass: "text-xs"
                },
                datetimeFormatter: {
                    year: 'yyyy',
                    month: "MMM 'yy",
                    day: 'dd MMM',
                    hour: 'HH:mm TT',
                }
            },
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            },
            title: {
                text: "🕐 Waktu",
                style: {
                    fontFamily: "Inter, sans-serif",
                    cssClass: "text-xs font-normal"
                }
            }
        },
        yaxis: {
            show: true,
            labels: {
                show: true,
                style: {
                    fontFamily: "Inter, sans-serif",
                    cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400"
                },
                formatter: function (value) {
                    return value;
                }
            },
            title: {
                text: "⚡ Watt",
                style: {
                    fontFamily: "Inter, sans-serif",
                    cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400"
                }
            }
        },
        chart: {
            sparkline: {
                enabled: false
            },
            animations: { enabled: false },
            height: "100%",
            width: "100%",
            type: "line",
            fontFamily: "Inter, sans-serif",
            dropShadow: {
                enabled: false
            },
            toolbar: {
                show: false
            }
        },
        tooltip: {
            enabled: true,
            x: {
                show: true,
                format: "dd MMM yyyy - HH:mm:ss TT"
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            width: 2,
            curve: 'straight'
        },
        legend: {
            show: true,
            position: "top",
            horizontalAlign: "right",
            showForSingleSeries: true
        },
        grid: {
            show: true
        },
    };


    const chart = new ApexCharts(document.querySelector("#labels-chart"), options)
    chart.render();

    const resetCssClasses = function (activeEl) {
        const els = document.querySelectorAll("button");
        els.forEach(el => {
            el.classList.remove("active");
        });

        activeEl.target.classList.add("active");
    };

    document.querySelector("#p0_six_hours").addEventListener("click", function (e) {
        resetCssClasses(e);

        chart.zoomX(new Date(sixHoursAgo).getTime() + timeZoneOffset);
    });

    document.querySelector("#p0_twelve_hours").addEventListener("click", function (e) {
        resetCssClasses(e);

        chart.zoomX(new Date(twelveHoursAgo).getTime() + timeZoneOffset);
    });

    document.querySelector("#p0_one_day").addEventListener("click", function (e) {
        resetCssClasses(e);

        chart.zoomX(new Date(twentyFourHoursAgo).getTime() + timeZoneOffset);
    });

    document.querySelector("#p0_three_day").addEventListener("click", function (e) {
        resetCssClasses(e);

        chart.zoomX(new Date(threeDaysAgo).getTime() + timeZoneOffset);
    });

    document.querySelector("#p0_six_day").addEventListener("click", function (e) {
        resetCssClasses(e);

        chart.zoomX(new Date(sixDaysAgo).getTime() + timeZoneOffset);
    });
}


// // Plot 2 configuration
// function createChartV12(data_v12) {
//     var options = {
//         xaxis: {
//             type: "datetime",
//             min: new Date(twentyFourHoursAgo).getTime() + timeZoneOffset,
//             datetimeUTC: false,
//             labels: {
//                 show: true,
//                 offsetY: -5,
//                 offsetX: 15,
//                 style: {
//                     fontFamily: "Inter, sans-serif",
//                     cssClass: "text-xs"
//                 }
//             },
//             axisBorder: {
//                 show: false
//             },
//             axisTicks: {
//                 show: false
//             },
//             title: {
//                 text: "Waktu",
//                 style: {
//                     fontFamily: "Inter, sans-serif",
//                     cssClass: "text-xs font-normal"
//                 }
//             }
//         },
//         yaxis: {
//             show: true,
//             labels: {
//                 show: true,
//                 style: {
//                     fontFamily: "Inter, sans-serif",
//                     cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400"
//                 },
//                 formatter: function (value) {
//                     return "⚡ " + value;
//                 }
//             },
//             title: {
//                 text: "Watt",
//                 style: {
//                     fontFamily: "Inter, sans-serif",
//                     cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400"
//                 }
//             }
//         },
//         series: [
//             {
//                 name: "Battery - Sunny Island",
//                 data: data_v12,
//                 color: "#00E396"
//             }
//         ],
//         chart: {
//             sparkline: {
//                 enabled: false
//             },
//             height: "100%",
//             width: "100%",
//             type: "area",
//             fontFamily: "Inter, sans-serif",
//             dropShadow: {
//                 enabled: false
//             },
//             toolbar: {
//                 show: false
//             }
//         },
//         tooltip: {
//             enabled: true,
//             x: {
//                 show: true,
//                 format: "dd MMM yyyy - HH:mm"
//             }
//         },
//         fill: {
//             type: "gradient",
//             gradient: {
//                 opacityFrom: 0.55,
//                 opacityTo: 0,
//                 shade: "#1C64F2",
//                 gradientToColors: ["#1C64F2"]
//             }
//         },
//         dataLabels: {
//             enabled: false
//         },
//         stroke: {
//             width: 2,
//             curve: 'straight'
//         },
//         legend: {
//             show: true,
//             position: "top",
//             horizontalAlign: "right",
//             showForSingleSeries: true
//         },
//         grid: {
//             show: false
//         },
//         animations: {
//             enabled: false
//         }
//     };

//     var chart = new ApexCharts(document.querySelector("#chart-2"), options);
//     chart.render();

//     const resetCssClasses = function (activeEl) {
//         const els = document.querySelectorAll("button");
//         els.forEach(el => {
//             el.classList.remove("active");
//         });

//         activeEl.target.classList.add("active");
//     };

//     document.querySelector("#p2_six_hours").addEventListener("click", function (e) {
//         resetCssClasses(e);

//         chart.zoomX(new Date(sixHoursAgo).getTime() + timeZoneOffset);
//     });

//     document.querySelector("#p2_twelve_hours").addEventListener("click", function (e) {
//         resetCssClasses(e);

//         chart.zoomX(new Date(twelveHoursAgo).getTime() + timeZoneOffset);
//     });

//     document.querySelector("#p2_one_day").addEventListener("click", function (e) {
//         resetCssClasses(e);

//         chart.zoomX(new Date(oneDayAgo).getTime() + timeZoneOffset);
//     });

//     document.querySelector("#p2_three_day").addEventListener("click", function (e) {
//         resetCssClasses(e);

//         chart.zoomX(new Date(threeDaysAgo).getTime() + timeZoneOffset);
//     });

//     document.querySelector("#p2_six_day").addEventListener("click", function (e) {
//         resetCssClasses(e);

//         chart.zoomX(new Date(sixDaysAgo).getTime() + timeZoneOffset);
//     });
// }

// // Plot 3 configuration
// function createChartV13(data_v13) {
//     var options = {
//         xaxis: {
//             type: "datetime",
//             min: new Date(twentyFourHoursAgo).getTime() + timeZoneOffset,
//             datetimeUTC: false,
//             labels: {
//                 show: true,
//                 offsetY: -5,
//                 offsetX: 15,
//                 style: {
//                     fontFamily: "Inter, sans-serif",
//                     cssClass: "text-xs"
//                 }
//             },
//             axisBorder: {
//                 show: false
//             },
//             axisTicks: {
//                 show: false
//             },
//             title: {
//                 text: "Waktu",
//                 style: {
//                     fontFamily: "Inter, sans-serif",
//                     cssClass: "text-xs font-normal"
//                 }
//             }
//         },
//         yaxis: {
//             show: true,
//             labels: {
//                 show: true,
//                 style: {
//                     fontFamily: "Inter, sans-serif",
//                     cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400"
//                 },
//                 formatter: function (value) {
//                     return "⚡ " + value;
//                 }
//             },
//             title: {
//                 text: "Watt",
//                 style: {
//                     fontFamily: "Inter, sans-serif",
//                     cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400"
//                 }
//             }
//         },
//         series: [
//             {
//                 name: "PV - Sunny Boy",
//                 data: data_v13,
//                 color: "#008FFB"
//             }
//         ],
//         chart: {
//             sparkline: {
//                 enabled: false
//             },
//             height: "100%",
//             width: "100%",
//             type: "area",
//             fontFamily: "Inter, sans-serif",
//             dropShadow: {
//                 enabled: false
//             },
//             toolbar: {
//                 show: false
//             }
//         },
//         tooltip: {
//             enabled: true,
//             x: {
//                 show: true,
//                 format: "dd MMM yyyy - HH:mm"
//             }
//         },
//         fill: {
//             type: "gradient",
//             gradient: {
//                 opacityFrom: 0.55,
//                 opacityTo: 0,
//                 shade: "#1C64F2",
//                 gradientToColors: ["#1C64F2"]
//             }
//         },
//         dataLabels: {
//             enabled: false
//         },
//         stroke: {
//             width: 2,
//             curve: 'straight'
//         },
//         legend: {
//             show: true,
//             position: "top",
//             horizontalAlign: "right",
//             showForSingleSeries: true
//         },
//         grid: {
//             show: false
//         },
//         animations: {
//             enabled: false
//         }
//     };

//     var chart = new ApexCharts(document.querySelector("#chart-3"), options);
//     chart.render();

//     const resetCssClasses = function (activeEl) {
//         const els = document.querySelectorAll("button");
//         els.forEach(el => {
//             el.classList.remove("active");
//         });

//         activeEl.target.classList.add("active");
//     };

//     document.querySelector("#p3_six_hours").addEventListener("click", function (e) {
//         resetCssClasses(e);

//         chart.zoomX(new Date(sixHoursAgo).getTime() + timeZoneOffset);
//     });

//     document.querySelector("#p3_twelve_hours").addEventListener("click", function (e) {
//         resetCssClasses(e);

//         chart.zoomX(new Date(twelveHoursAgo).getTime() + timeZoneOffset);
//     });

//     document.querySelector("#p3_one_day").addEventListener("click", function (e) {
//         resetCssClasses(e);

//         chart.zoomX(new Date(oneDayAgo).getTime() + timeZoneOffset);
//     });

//     document.querySelector("#p3_three_day").addEventListener("click", function (e) {
//         resetCssClasses(e);

//         chart.zoomX(new Date(threeDaysAgo).getTime() + timeZoneOffset);
//     });

//     document.querySelector("#p3_six_day").addEventListener("click", function (e) {
//         resetCssClasses(e);

//         chart.zoomX(new Date(sixDaysAgo).getTime() + timeZoneOffset);
//     });
// }

// // Plot 4 configuration
// function createChartBill(bill_vpp1, bill_vpp2, bill_vpp3) {
//     var options = {
//         xaxis: {
//             type: "datetime",
//             min: new Date(twentyFourHoursAgo).getTime() + timeZoneOffset,
//             datetimeUTC: false,
//             labels: {
//                 show: true,
//                 offsetY: -5,
//                 offsetX: 15,
//                 style: {
//                     fontFamily: "Inter, sans-serif",
//                     cssClass: "text-xs"
//                 }
//             },
//             axisBorder: {
//                 show: false
//             },
//             axisTicks: {
//                 show: false
//             },
//             title: {
//                 text: "Waktu",
//                 style: {
//                     fontFamily: "Inter, sans-serif",
//                     cssClass: "text-xs font-normal"
//                 }
//             }
//         },
//         yaxis: {
//             show: true,
//             labels: {
//                 show: true,
//                 style: {
//                     fontFamily: "Inter, sans-serif",
//                     cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400"
//                 },
//                 formatter: function (value) {
//                     return "Rp " + value;
//                 }
//             },
//             title: {
//                 text: "Watt",
//                 style: {
//                     fontFamily: "Inter, sans-serif",
//                     cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400"
//                 }
//             }
//         },
//         series: [
//             {
//                 name: "BILL - VPP 1",
//                 data: bill_vpp1,
//                 color: "#008FFB"
//             }, {
//                 name: "BILL - VPP 2",
//                 data: bill_vpp2,
//                 color: "#FF7F00"
//             }, {
//                 name: "BILL - VPP 3",
//                 data: bill_vpp3,
//                 color: "#00E396"
//             }
//         ],
//         chart: {
//             sparkline: {
//                 enabled: false
//             },
//             height: "100%",
//             width: "100%",
//             type: "area",
//             fontFamily: "Inter, sans-serif",
//             dropShadow: {
//                 enabled: false
//             },
//             toolbar: {
//                 show: false
//             }
//         },
//         tooltip: {
//             enabled: true,
//             x: {
//                 show: true,
//                 format: "dd MMM yyyy - HH:mm"
//             }
//         },
//         fill: {
//             type: "gradient",
//             gradient: {
//                 opacityFrom: 0.55,
//                 opacityTo: 0,
//                 shade: "#1C64F2",
//                 gradientToColors: ["#1C64F2"]
//             }
//         },
//         dataLabels: {
//             enabled: false
//         },
//         stroke: {
//             width: 2,
//             curve: 'straight'
//         },
//         legend: {
//             show: true,
//             position: "top",
//             horizontalAlign: "right",
//             showForSingleSeries: true
//         },
//         grid: {
//             show: false
//         },
//         animations: {
//             enabled: false
//         }
//     };

//     var chart = new ApexCharts(document.querySelector("#chart-4"), options);
//     chart.render();

//     const resetCssClasses = function (activeEl) {
//         const els = document.querySelectorAll("button");
//         els.forEach(el => {
//             el.classList.remove("active");
//         });

//         activeEl.target.classList.add("active");
//     };

//     document.querySelector("#p4_six_hours").addEventListener("click", function (e) {
//         resetCssClasses(e);

//         chart.zoomX(new Date(sixHoursAgo).getTime() + timeZoneOffset);
//     });

//     document.querySelector("#p4_twelve_hours").addEventListener("click", function (e) {
//         resetCssClasses(e);

//         chart.zoomX(new Date(twelveHoursAgo).getTime() + timeZoneOffset);
//     });

//     document.querySelector("#p4_one_day").addEventListener("click", function (e) {
//         resetCssClasses(e);

//         chart.zoomX(new Date(oneDayAgo).getTime() + timeZoneOffset);
//     });

//     document.querySelector("#p4_three_day").addEventListener("click", function (e) {
//         resetCssClasses(e);

//         chart.zoomX(new Date(threeDaysAgo).getTime() + timeZoneOffset);
//     });

//     document.querySelector("#p4_six_day").addEventListener("click", function (e) {
//         resetCssClasses(e);

//         chart.zoomX(new Date(sixDaysAgo).getTime() + timeZoneOffset);
//     });
// }

// Fetch data and create charts on page load
fetchAndCreateCharts();

// var areaOptions = {
//     series: [
//         {
//             name: "series1",
//             data: [31, 40, 28, 51, 42, 109, 100],
//         },
//         {
//             name: "series2",
//             data: [11, 32, 45, 32, 34, 52, 41],
//         },
//     ],
//     chart: {
//         height: 350,
//         type: "area",
//     },
//     dataLabels: {
//         enabled: false,
//     },
//     stroke: {
//         curve: "smooth",
//     },
//     xaxis: {
//         type: "datetime",
//         categories: [
//             "2018-09-19T00:00:00.000Z",
//             "2018-09-19T01:30:00.000Z",
//             "2018-09-19T02:30:00.000Z",
//             "2018-09-19T03:30:00.000Z",
//             "2018-09-19T04:30:00.000Z",
//             "2018-09-19T05:30:00.000Z",
//             "2018-09-19T06:30:00.000Z",
//         ],
//     },
//     tooltip: {
//         x: {
//             format: "dd/MM/yy HH:mm",
//         },
//     },
// }
// var candle = new ApexCharts(document.querySelector("#labels-chart"), options)
// var area = new ApexCharts(document.querySelector("#area"), areaOptions)

// area.render()
// candle.render()
