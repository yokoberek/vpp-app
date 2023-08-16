// Utility function to create date string with options
function formatDate(date, options) {
    return date.toLocaleDateString("en-US", options);
}

// Calculate date values
const timeZoneOffset = 7 * 60 * 60 * 1000; // Offset untuk GMT+7 dalam milidetik
const currentDate = new Date();
const options = {
    day: "numeric", month: "short", year: "numeric"
};
const twentyFourHoursAgo = new Date(currentDate - 24 * 60 * 60 * 1000); // Waktu 24 jam lalu
const today = formatDate(currentDate, options);
const sixHoursAgo = new Date(currentDate - 6 * 60 * 60 * 1000); // Waktu 6 jam lalu
const twelveHoursAgo = new Date(currentDate - 12 * 60 * 60 * 1000); // Waktu 12 jam lalu
const oneDayAgo = new Date(currentDate - 24 * 60 * 60 * 1000); // Waktu 1 hari lalu
const threeDaysAgo = new Date(currentDate - 3 * 24 * 60 * 60 * 1000); // Waktu 3 hari lalu
const sixDaysAgo = new Date(currentDate - 6 * 24 * 60 * 60 * 1000); // Waktu 6 hari lalu


// Fetch API data and create charts
function fetchAndCreateCharts() {
    const headers = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    fetch("/api/equipment", {
        method: "GET", headers: headers
    }).then(response => response.json()).then(data => {
        const data_v10 = data['data_v10'];
        const data_v11 = data['data_v11'];
        const data_v12 = data['data_v12'];
        const data_v13 = data['data_v13'];

        createChartV10andV11(data_v10, data_v11);
        createChartV12(data_v12);
        createChartV13(data_v13);
    });

    fetch("/api/bill", {
        method: "GET", headers: headers
    }).then(response => response.json()).then(data => {
        const bill_vpp1 = data['bill_vpp1'];
        const bill_vpp2 = data['bill_vpp2'];
        const bill_vpp3 = data['bill_vpp3'];

        createChartBill(bill_vpp1, bill_vpp2, bill_vpp3);
    });
}

// Plot 1 configuration
function createChartV10andV11(data_v10, data_v11) {
    var options = {
        xaxis: {
            type: "datetime",
            min: new Date(twentyFourHoursAgo).getTime() + timeZoneOffset,
            datetimeUTC: false,
            labels: {
                show: true, offsetY: -5, offsetX: 15, style: {
                    fontFamily: "Inter, sans-serif", cssClass: "text-xs"
                }
            }, axisBorder: {
                show: false
            }, axisTicks: {
                show: false
            }, title: {
                text: "Waktu", style: {
                    fontFamily: "Inter, sans-serif", cssClass: "text-xs font-normal"
                }
            }
        }, yaxis: {
            show: true, labels: {
                show: true, style: {
                    fontFamily: "Inter, sans-serif", cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400"
                }, formatter: function (value) {
                    return "⚡ " + value;
                }
            }, title: {
                text: "Watt", style: {
                    fontFamily: "Inter, sans-serif", cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400"
                }
            }
        }, series: [{
            name: "PV - Sunny Tripower", data: data_v10, color: "#008FFB"
        }, {
            name: "Battery - Sunny Island", data: data_v11, color: "#00E396"
        }], chart: {
            sparkline: {
                enabled: false
            }, height: "100%", width: "100%", type: "area", fontFamily: "Inter, sans-serif", dropShadow: {
                enabled: false
            }, toolbar: {
                show: false
            }
        }, tooltip: {
            enabled: true, x: {
                show: true, format: "dd MMM yyyy - HH:mm"
            }
        }, fill: {
            type: "gradient", gradient: {
                opacityFrom: 0.55, opacityTo: 0, shade: "#1C64F2", gradientToColors: ["#1C64F2"]
            }
        }, dataLabels: {
            enabled: false
        }, stroke: {
            width: 6
        }, legend: {
            show: true, position: "top", horizontalAlign: "right", showForSingleSeries: true
        }, grid: {
            show: false
        }
    };

    var chart = new ApexCharts(document.querySelector("#chart-1"), options);
    chart.render();

    const resetCssClasses = function (activeEl) {
        const els = document.querySelectorAll("button");
        els.forEach(el => {
            el.classList.remove("active");
        });

        activeEl.target.classList.add("active");
    };

    document.querySelector("#p1_six_hours").addEventListener("click", function (e) {
        resetCssClasses(e);

        chart.zoomX(new Date(sixHoursAgo).getTime() + timeZoneOffset);
    });

    document.querySelector("#p1_twelve_hours").addEventListener("click", function (e) {
        resetCssClasses(e);

        chart.zoomX(new Date(twelveHoursAgo).getTime() + timeZoneOffset);
    });

    document.querySelector("#p1_one_day").addEventListener("click", function (e) {
        resetCssClasses(e);

        chart.zoomX(new Date(oneDayAgo).getTime() + timeZoneOffset);
    });

    document.querySelector("#p1_three_day").addEventListener("click", function (e) {
        resetCssClasses(e);

        chart.zoomX(new Date(threeDaysAgo).getTime() + timeZoneOffset);
    });

    document.querySelector("#p1_six_day").addEventListener("click", function (e) {
        resetCssClasses(e);

        chart.zoomX(new Date(sixDaysAgo).getTime() + timeZoneOffset);
    });
}

// Plot 2 configuration
function createChartV12(data_v12) {
    var options = {
        xaxis: {
            type: "datetime",
            min: new Date(twentyFourHoursAgo).getTime() + timeZoneOffset,
            datetimeUTC: false,
            labels: {
                show: true, offsetY: -5, offsetX: 15, style: {
                    fontFamily: "Inter, sans-serif", cssClass: "text-xs"
                }
            }, axisBorder: {
                show: false
            }, axisTicks: {
                show: false
            }, title: {
                text: "Waktu", style: {
                    fontFamily: "Inter, sans-serif", cssClass: "text-xs font-normal"
                }
            }
        }, yaxis: {
            show: true, labels: {
                show: true, style: {
                    fontFamily: "Inter, sans-serif", cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400"
                }, formatter: function (value) {
                    return "⚡ " + value;
                }
            }, title: {
                text: "Watt", style: {
                    fontFamily: "Inter, sans-serif", cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400"
                }
            }
        }, series: [{
            name: "Battery - Sunny Island", data: data_v12, color: "#00E396"
        }], chart: {
            sparkline: {
                enabled: false
            }, height: "100%", width: "100%", type: "area", fontFamily: "Inter, sans-serif", dropShadow: {
                enabled: false
            }, toolbar: {
                show: false
            }
        }, tooltip: {
            enabled: true, x: {
                show: true, format: "dd MMM yyyy - HH:mm"
            }
        }, fill: {
            type: "gradient", gradient: {
                opacityFrom: 0.55, opacityTo: 0, shade: "#1C64F2", gradientToColors: ["#1C64F2"]
            }
        }, dataLabels: {
            enabled: false
        }, stroke: {
            width: 6
        }, legend: {
            show: true, position: "top", horizontalAlign: "right", showForSingleSeries: true
        }, grid: {
            show: false
        }
    };

    var chart = new ApexCharts(document.querySelector("#chart-2"), options);
    chart.render();

    const resetCssClasses = function (activeEl) {
        const els = document.querySelectorAll("button");
        els.forEach(el => {
            el.classList.remove("active");
        });

        activeEl.target.classList.add("active");
    };

    document.querySelector("#p2_six_hours").addEventListener("click", function (e) {
        resetCssClasses(e);

        chart.zoomX(new Date(sixHoursAgo).getTime() + timeZoneOffset);
    });

    document.querySelector("#p2_twelve_hours").addEventListener("click", function (e) {
        resetCssClasses(e);

        chart.zoomX(new Date(twelveHoursAgo).getTime() + timeZoneOffset);
    });

    document.querySelector("#p2_one_day").addEventListener("click", function (e) {
        resetCssClasses(e);

        chart.zoomX(new Date(oneDayAgo).getTime() + timeZoneOffset);
    });

    document.querySelector("#p2_three_day").addEventListener("click", function (e) {
        resetCssClasses(e);

        chart.zoomX(new Date(threeDaysAgo).getTime() + timeZoneOffset);
    });

    document.querySelector("#p2_six_day").addEventListener("click", function (e) {
        resetCssClasses(e);

        chart.zoomX(new Date(sixDaysAgo).getTime() + timeZoneOffset);
    });
}

// Plot 3 configuration
function createChartV13(data_v13) {
    var options = {
        xaxis: {
            type: "datetime",
            min: new Date(twentyFourHoursAgo).getTime() + timeZoneOffset,
            datetimeUTC: false,
            labels: {
                show: true, offsetY: -5, offsetX: 15, style: {
                    fontFamily: "Inter, sans-serif", cssClass: "text-xs"
                }
            }, axisBorder: {
                show: false
            }, axisTicks: {
                show: false
            }, title: {
                text: "Waktu", style: {
                    fontFamily: "Inter, sans-serif", cssClass: "text-xs font-normal"
                }
            }
        }, yaxis: {
            show: true, labels: {
                show: true, style: {
                    fontFamily: "Inter, sans-serif", cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400"
                }, formatter: function (value) {
                    return "⚡ " + value;
                }
            }, title: {
                text: "Watt", style: {
                    fontFamily: "Inter, sans-serif", cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400"
                }
            }
        }, series: [{
            name: "PV - Sunny Boy", data: data_v13, color: "#008FFB"
        }], chart: {
            sparkline: {
                enabled: false
            }, height: "100%", width: "100%", type: "area", fontFamily: "Inter, sans-serif", dropShadow: {
                enabled: false
            }, toolbar: {
                show: false
            }
        }, tooltip: {
            enabled: true, x: {
                show: true, format: "dd MMM yyyy - HH:mm"
            }
        }, fill: {
            type: "gradient", gradient: {
                opacityFrom: 0.55, opacityTo: 0, shade: "#1C64F2", gradientToColors: ["#1C64F2"]
            }
        }, dataLabels: {
            enabled: false
        }, stroke: {
            width: 6
        }, legend: {
            show: true, position: "top", horizontalAlign: "right", showForSingleSeries: true

        }, grid: {
            show: false
        }
    };

    var chart = new ApexCharts(document.querySelector("#chart-3"), options);
    chart.render();

    const resetCssClasses = function (activeEl) {
        const els = document.querySelectorAll("button");
        els.forEach(el => {
            el.classList.remove("active");
        });

        activeEl.target.classList.add("active");
    };

    document.querySelector("#p3_six_hours").addEventListener("click", function (e) {
        resetCssClasses(e);

        chart.zoomX(new Date(sixHoursAgo).getTime() + timeZoneOffset);
    });

    document.querySelector("#p3_twelve_hours").addEventListener("click", function (e) {
        resetCssClasses(e);

        chart.zoomX(new Date(twelveHoursAgo).getTime() + timeZoneOffset);
    });

    document.querySelector("#p3_one_day").addEventListener("click", function (e) {
        resetCssClasses(e);

        chart.zoomX(new Date(oneDayAgo).getTime() + timeZoneOffset);
    });

    document.querySelector("#p3_three_day").addEventListener("click", function (e) {
        resetCssClasses(e);

        chart.zoomX(new Date(threeDaysAgo).getTime() + timeZoneOffset);
    });

    document.querySelector("#p3_six_day").addEventListener("click", function (e) {
        resetCssClasses(e);

        chart.zoomX(new Date(sixDaysAgo).getTime() + timeZoneOffset);
    });
}

// Plot 4 configuration
function createChartBill(bill_vpp1, bill_vpp2, bill_vpp3) {
    var options = {
        xaxis: {
            type: "datetime",
            min: new Date(twentyFourHoursAgo).getTime() + timeZoneOffset,
            datetimeUTC: false,
            labels: {
                show: true, offsetY: -5, offsetX: 15, style: {
                    fontFamily: "Inter, sans-serif", cssClass: "text-xs"
                }
            }, axisBorder: {
                show: false
            }, axisTicks: {
                show: false
            }, title: {
                text: "Waktu", style: {
                    fontFamily: "Inter, sans-serif", cssClass: "text-xs font-normal"
                }
            }
        }, yaxis: {
            show: true, labels: {
                show: true, style: {
                    fontFamily: "Inter, sans-serif", cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400"
                }, formatter: function (value) {
                    return "Rp " + value;
                }
            }, title: {
                text: "Watt", style: {
                    fontFamily: "Inter, sans-serif", cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400"
                }
            }
        }, series: [{
            name: "BILL - VPP 1", data: bill_vpp1, color: "#008FFB"
        }, {
            name: "BILL - VPP 2", data: bill_vpp2, color: "#FF7F00"
        }, {
            name: "BILL - VPP 3", data: bill_vpp3, color: "#00E396"
        }], chart: {
            sparkline: {
                enabled: false
            }, height: "100%", width: "100%", type: "area", fontFamily: "Inter, sans-serif", dropShadow: {
                enabled: false
            }, toolbar: {
                show: false
            }
        }, tooltip: {
            enabled: true, x: {
                show: true, format: "dd MMM yyyy - HH:mm"
            }
        }, fill: {
            type: "gradient", gradient: {
                opacityFrom: 0.55, opacityTo: 0, shade: "#1C64F2", gradientToColors: ["#1C64F2"]
            }
        }, dataLabels: {
            enabled: false
        }, stroke: {
            width: 6
        }, legend: {
            show: true, position: "top", horizontalAlign: "right", showForSingleSeries: true
        }, grid: {
            show: false
        }
    };

    var chart = new ApexCharts(document.querySelector("#chart-4"), options);
    chart.render();

    const resetCssClasses = function (activeEl) {
        const els = document.querySelectorAll("button");
        els.forEach(el => {
            el.classList.remove("active");
        });

        activeEl.target.classList.add("active");
    };

    document.querySelector("#p4_six_hours").addEventListener("click", function (e) {
        resetCssClasses(e);

        chart.zoomX(new Date(sixHoursAgo).getTime() + timeZoneOffset);
    });

    document.querySelector("#p4_twelve_hours").addEventListener("click", function (e) {
        resetCssClasses(e);

        chart.zoomX(new Date(twelveHoursAgo).getTime() + timeZoneOffset);
    });

    document.querySelector("#p4_one_day").addEventListener("click", function (e) {
        resetCssClasses(e);

        chart.zoomX(new Date(oneDayAgo).getTime() + timeZoneOffset);
    });

    document.querySelector("#p4_three_day").addEventListener("click", function (e) {
        resetCssClasses(e);

        chart.zoomX(new Date(threeDaysAgo).getTime() + timeZoneOffset);
    });

    document.querySelector("#p4_six_day").addEventListener("click", function (e) {
        resetCssClasses(e);

        chart.zoomX(new Date(sixDaysAgo).getTime() + timeZoneOffset);
    });
}

// Fetch data and create charts on page load
fetchAndCreateCharts();
