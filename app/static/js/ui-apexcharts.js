// Utility function to create date string with options
function formatDate(date, options) {
    return date.toLocaleDateString("en-US", options);
}

// Calculate date values
const currentDate = new Date();
const options = {
    day: "numeric",
    month: "short",
    year: "numeric"
};
const yesterday = new Date(currentDate - 24 * 60 * 60 * 1000);
const today = new Date(currentDate);
const oneWeekAgo = new Date(currentDate - 7 * 24 * 60 * 60 * 1000);
const oneMonthAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());

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
    })
    .then(response => response.json())
    .then(data => {
        const data_v10 = data['data_v10'];
        const data_v11 = data['data_v11'];
        const data_v12 = data['data_v12'];
        const data_v13 = data['data_v13'];

        createChartV10andV11(data_v10, data_v11);
        createChartV12(data_v12);
        createChartV13(data_v13);
    });

    fetch("/api/bill", {
        method: "GET",
        headers: headers
    })
    .then(response => response.json())
    .then(data => {
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
            min: new Date(today).getTime(),
            datetimeUTC: false,
            labels: {
                show: true,
                offsetY: -5,
                offsetX: 15,
                style: {
                    fontFamily: "Inter, sans-serif",
                    cssClass: "text-xs"
                }
            },
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            },
            title: {
                text: "Waktu",
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
                    return "⚡ " + value;
                }
            },
            title: {
                text: "Watt",
                style: {
                    fontFamily: "Inter, sans-serif",
                    cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400"
                }
            }
        },
        series: [
            {
                name: "PV - Sunny Tripower",
                data: data_v10,
                color: "#008FFB",
            },
            {
                name: "Battery - Sunny Island",
                data: data_v11,
                color: "#00E396",
            }
        ],
        chart: {
            sparkline: {
                enabled: false
            },
            height: "100%",
            width: "100%",
            type: "area",
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
                show: false
            }
        },
        fill: {
            type: "gradient",
            gradient: {
                opacityFrom: 0.55,
                opacityTo: 0,
                shade: "#1C64F2",
                gradientToColors: ["#1C64F2"]
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            width: 6
        },
        legend: {
            show: true,
            position: "top",
            horizontalAlign: "right",            
            showForSingleSeries: true,
        },
        grid: {
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

    document.querySelector("#p1_today").addEventListener("click", function (e) {
        resetCssClasses(e);

        chart.zoomX(new Date(today).getTime());
    });

    document.querySelector("#p1_one_week").addEventListener("click", function (e) {
        resetCssClasses(e);

        chart.zoomX(new Date(oneWeekAgo).getTime(), new Date(today).getTime());
    });

    document.querySelector("#p1_one_month").addEventListener("click", function (e) {
        resetCssClasses(e);

        chart.zoomX(new Date(oneMonthAgo).getTime(), new Date(today).getTime());
    });
}

// Plot 2 configuration
function createChartV12(data_v12) {
    var options = {
        xaxis: {
            type: "datetime",
            min: new Date(today).getTime(),
            datetimeUTC: false,
            labels: {
                show: true,
                offsetY: -5,
                offsetX: 15,
                style: {
                    fontFamily: "Inter, sans-serif",
                    cssClass: "text-xs"
                }
            },
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            },
            title: {
                text: "Waktu",
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
                    return "⚡ " + value;
                }
            },
            title: {
                text: "Watt",
                style: {
                    fontFamily: "Inter, sans-serif",
                    cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400"
                }
            }
        },
        series: [
            {
                name: "Battery - Sunny Island",
                data: data_v12,
                color: "#00E396",
            }
        ],
        chart: {
            sparkline: {
                enabled: false
            },
            height: "100%",
            width: "100%",
            type: "area",
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
                show: false
            }
        },
        fill: {
            type: "gradient",
            gradient: {
                opacityFrom: 0.55,
                opacityTo: 0,
                shade: "#1C64F2",
                gradientToColors: ["#1C64F2"]
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            width: 6
        },
        legend: {
            show: true,
            position: "top",
            horizontalAlign: "right",
            showForSingleSeries: true,
        },
        grid: {
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

    document.querySelector("#p2_today").addEventListener("click", function (e) {
        resetCssClasses(e);

        chart.zoomX(new Date(today).getTime());
    });

    document.querySelector("#p2_one_week").addEventListener("click", function (e) {
        resetCssClasses(e);

        chart.zoomX(new Date(oneWeekAgo).getTime(), new Date(today).getTime());
    });

    document.querySelector("#p2_one_month").addEventListener("click", function (e) {
        resetCssClasses(e);

        chart.zoomX(new Date(oneMonthAgo).getTime(), new Date(today).getTime());
    });
}

// Plot 3 configuration
function createChartV13(data_v13) {
    var options = {
        xaxis: {
            type: "datetime",
            min: new Date(today).getTime(),
            datetimeUTC: false,
            labels: {
                show: true,
                offsetY: -5,
                offsetX: 15,
                style: {
                    fontFamily: "Inter, sans-serif",
                    cssClass: "text-xs"
                }
            },
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            },
            title: {
                text: "Waktu",
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
                    return "⚡ " + value;
                }
            },
            title: {
                text: "Watt",
                style: {
                    fontFamily: "Inter, sans-serif",
                    cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400"
                }
            }
        },
        series: [
            {
                name: "PV - Sunny Boy",
                data: data_v13,
                color: "#008FFB",
            }
        ],
        chart: {
            sparkline: {
                enabled: false
            },
            height: "100%",
            width: "100%",
            type: "area",
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
                show: false
            }
        },
        fill: {
            type: "gradient",
            gradient: {
                opacityFrom: 0.55,
                opacityTo: 0,
                shade: "#1C64F2",
                gradientToColors: ["#1C64F2"]
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            width: 6
        },
        legend: {
            show: true,
            position: "top",
            horizontalAlign: "right",
            showForSingleSeries: true,
            
        },
        grid: {
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

    document.querySelector("#p3_today").addEventListener("click", function (e) {
        resetCssClasses(e);

        chart.zoomX(new Date(today).getTime());
    });

    document.querySelector("#p3_one_week").addEventListener("click", function (e) {
        resetCssClasses(e);

        chart.zoomX(new Date(oneWeekAgo).getTime(), new Date(today).getTime());
    });

    document.querySelector("#p3_one_month").addEventListener("click", function (e) {
        resetCssClasses(e);

        chart.zoomX(new Date(oneMonthAgo).getTime(), new Date(today).getTime());
    });
}

// Plot 4 configuration
function createChartBill(bill_vpp1, bill_vpp2, bill_vpp3) {
    var options = {
        xaxis: {
            type: "datetime",
            min: new Date(today).getTime(),
            datetimeUTC: false,
            labels: {
                show: true,
                offsetY: -5,
                offsetX: 15,
                style: {
                    fontFamily: "Inter, sans-serif",
                    cssClass: "text-xs"
                }
            },
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            },
            title: {
                text: "Waktu",
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
                    return "Rp " + value;
                }
            },
            title: {
                text: "Watt",
                style: {
                    fontFamily: "Inter, sans-serif",
                    cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400"
                }
            }
        },
        series: [
            {
                name: "BILL - VPP 1",
                data: bill_vpp1,
                color: "#008FFB",
            },
            {
                name: "BILL - VPP 2",
                data: bill_vpp2,
                color: "#FF7F00",
            },
            {
                name: "BILL - VPP 3",
                data: bill_vpp3,
                color: "#00E396",
            }
        ],
        chart: {
            sparkline: {
                enabled: false
            },
            height: "100%",
            width: "100%",
            type: "area",
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
                show: false
            }
        },
        fill: {
            type: "gradient",
            gradient: {
                opacityFrom: 0.55,
                opacityTo: 0,
                shade: "#1C64F2",
                gradientToColors: ["#1C64F2"]
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            width: 6
        },
        legend: {
            show: true,
            position: "top",
            horizontalAlign: "right",            
            showForSingleSeries: true,
        },
        grid: {
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

    document.querySelector("#p4_today").addEventListener("click", function (e) {
        resetCssClasses(e);

        chart.zoomX(new Date(today).getTime());
    });

    document.querySelector("#p4_one_week").addEventListener("click", function (e) {
        resetCssClasses(e);

        chart.zoomX(new Date(oneWeekAgo).getTime(), new Date(today).getTime());
    });

    document.querySelector("#p4_one_month").addEventListener("click", function (e) {
        resetCssClasses(e);

        chart.zoomX(new Date(oneMonthAgo).getTime(), new Date(today).getTime());
    });
}

// Fetch data and create charts on page load
fetchAndCreateCharts();