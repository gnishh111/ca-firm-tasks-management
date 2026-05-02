import { useState, useEffect } from "react";
import api from "@/api/axios";
import Footer from "@/components/admin/Footer";
import moment from "moment";

function DealsDashboard() {

    useEffect(() => {
        let dealsTable;
        let dealsChart, lostChart, wonChart, yearChart;

        const initPlugins = async () => {
            // jQuery
            const jqueryModule = await import("jquery");
            const $ = jqueryModule.default;
            window.$ = window.jQuery = $;

            // Moment MUST be global
            const momentModule = await import("moment");
            window.moment = momentModule.default;

            // Bootstrap (JS only)
            const bootstrap = await import("bootstrap");
            document
                .querySelectorAll('[data-bs-toggle="tooltip"]')
                .forEach(el => new bootstrap.Tooltip(el));

            // Date Range Picker (after moment!)
            await import("daterangepicker");
            $(".daterangepick").daterangepicker();

            // DataTable
            await import("datatables.net-bs5");
            dealsTable = $("#deals-project").DataTable({
                responsive: true,
                pageLength: 5,
            });

            // ApexCharts
            const ApexCharts = (await import("apexcharts")).default;

            dealsChart = new ApexCharts(
                document.querySelector("#deals-chart"),
                {
                    chart: { type: "bar" },
                    series: [
                        {
                            name: "Lost Deals",
                            data: [400, 130, 248, 470, 470, 180]
                        }
                    ],
                    colors: ["#4f3b3bae"],
                    plotOptions: {
                        bar: {
                            horizontal: false,
                            barHeight: "70%",
                            borderRadius: 5
                        }
                    },
                    xaxis: {
                        categories: ["Inpipeline", "Follow Up", "Schedule", "Conversation", "Won", "Lost"]
                    },
                    yaxis: {
                        min: 0,
                        max: 500,
                        tickAmount: 5,
                        axisBorder: {
                            show: true,
                            strokeDashArray: 4
                        }
                    },
                    grid: {
                        borderColor: "#e5e7eb",
                        strokeDashArray: 6
                    },
                    dataLabels: {
                        enabled: true
                    }
                }
            );
            dealsChart.render();

            lostChart = new ApexCharts(
                document.querySelector("#last-chart"),
                {
                    chart: { type: "bar" },
                    series: [
                        {
                            name: "series-1",
                            data: [400, 220, 448]
                        }
                    ],
                    colors: ["#e41717ae"],
                    plotOptions: {
                        bar: {
                            horizontal: true,
                            barHeight: "70%",
                            borderRadius: 5
                        }
                    },
                    xaxis: {
                        categories: ["Conversation", "Follow Up", "Inpipeline"]
                    },
                    yaxis: {
                        min: 0,
                        max: 500,
                        tickAmount: 5,
                        axisBorder: {
                            show: true,
                            strokeDashArray: 4
                        }
                    },
                    grid: {
                        borderColor: "#e5e7eb",
                        strokeDashArray: 6
                    },
                    dataLabels: {
                        enabled: true
                    }
                }
            );
            lostChart.render();

            wonChart = new ApexCharts(
                document.querySelector("#won-chart"),
                {
                    chart: { type: "bar" },
                    series: [
                        {
                            name: "series-1",
                            data: [400, 122, 250]
                        }
                    ],
                    colors: ["#07c249cb"],
                    plotOptions: {
                        bar: {
                            horizontal: true,
                            barHeight: "70%",
                            borderRadius: 5
                        }
                    },
                    xaxis: {
                        categories: ["Conversation", "Follow Up", "Inpipeline"]
                    },
                    yaxis: {
                        min: 0,
                        max: 400,
                        tickAmount: 5,
                        axisBorder: {
                            show: true,
                            strokeDashArray: 4
                        }
                    },
                    grid: {
                        borderColor: "#e5e7eb",
                        strokeDashArray: 6
                    },
                    dataLabels: {
                        enabled: true
                    }
                }
            );
            wonChart.render();

            yearChart = new ApexCharts(
                document.querySelector("#deals-year"),
                {
                    chart: { type: "line" },
                    series: [
                        {
                            name: "series-1",
                            data: [1000, 2000, 3000, 1500, 2200, 4000, 3000, 2000, 3000, 1800, 3000, 6000]
                        }
                    ],
                    colors: ["#07c249cb"],
                    stroke: {
                        curve: "smooth",
                        width: 2,
                        dashArray: 3
                    },
                    markers: {
                        size: 5,
                        colors: ["#3b82f6"],
                        strokeColors: "#000",
                        strokeWidth: 2,
                        hover: { size: 7 }
                    },
                    xaxis: {
                        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                    },
                    yaxis: {
                        min: 1000,
                        max: 6000,
                        tickAmount: 6,
                        labels: {
                            formatter: function (val) {
                                return val / 1000 + "k";
                            }
                        }
                    },
                    grid: {
                        borderColor: "#e5e7eb",
                        strokeDashArray: 5
                    },
                    dataLabels: {
                        enabled: true,
                        labels: {
                            formatter: function (val) {
                                return val / 1000 + "k";
                            }
                        }
                    }
                }
            );
            yearChart.render();
        };

        initPlugins();

        return () => {
            if (dealsTable) dealsTable.destroy();
            if (dealsChart) dealsChart.destroy();
            if (lostChart) lostChart.destroy();
            if (wonChart) wonChart.destroy();
            if (yearChart) yearChart.destroy();
        };
    }, []);

    return (
        <div className="page-wrapper">
            <div className="content pb-0">

                <div className="d-flex align-items-center justify-content-between gap-2 mb-4 flex-wrap">
                    <div>
                        <h4 className="mb-0">Deals Dashboard</h4>
                    </div>
                    <div className="gap-2 d-flex align-items-center flex-wrap">
                        <div className="daterangepick form-control w-auto d-flex align-items-center">
                            <i className="ti ti-calendar text-dark me-2"></i>
                            <span className="reportrange-picker-field text-dark">23 May 2025 - 30 May 2025</span>
                        </div>
                        <a href="javascript:void(0);" className="btn btn-icon btn-outline-light shadow" data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Refresh" data-bs-original-title="Refresh"><i className="ti ti-refresh"></i></a>
                        <a href="javascript:void(0);" className="btn btn-icon btn-outline-light shadow" data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Collapse" data-bs-original-title="Collapse" id="collapse-header"><i className="ti ti-transition-top"></i></a>
                    </div>
                </div>

                <div className="row">

                    <div className="col-md-6 d-flex">
                        <div className="card flex-fill">
                            <div className="card-header">
                                <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                                    <h6 className="mb-0">Deals By Stage</h6>
                                    <div className="d-flex align-items-center flex-wrap row-gap-3">
                                        <div className="dropdown me-2">
                                            <a className="dropdown-toggle btn btn-outline-light shadow" data-bs-toggle="dropdown" href="javascript:void(0);">
                                                Sales Pipeline
                                            </a>
                                            <div className="dropdown-menu dropdown-menu-end">
                                                <a href="javascript:void(0);" className="dropdown-item">
                                                    Marketing Pipeline
                                                </a>
                                                <a href="javascript:void(0);" className="dropdown-item">
                                                    Sales Pipeline
                                                </a>
                                                <a href="javascript:void(0);" className="dropdown-item">
                                                    Email
                                                </a>
                                                <a href="javascript:void(0);" className="dropdown-item">
                                                    Chats
                                                </a>
                                                <a href="javascript:void(0);" className="dropdown-item">
                                                    Operational
                                                </a>
                                            </div>
                                        </div>
                                        <div className="dropdown">
                                            <a className="dropdown-toggle btn btn-outline-light shadow" data-bs-toggle="dropdown" href="javascript:void(0);">
                                                Last 30 Days
                                            </a>
                                            <div className="dropdown-menu dropdown-menu-end">
                                                <a href="javascript:void(0);" className="dropdown-item">
                                                    Last 30 Days
                                                </a>
                                                <a href="javascript:void(0);" className="dropdown-item">
                                                    Last 15 Days
                                                </a>
                                                <a href="javascript:void(0);" className="dropdown-item">
                                                    Last 7 Days
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body py-0">
                                <div id="deals-chart"></div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 d-flex">
                        <div className="card flex-fill">
                            <div className="card-header">
                                <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                                    <h6 className="mb-0">Lost Deals Stage</h6>
                                    <div className="d-flex align-items-center flex-wrap row-gap-3">
                                        <div className="dropdown me-2">
                                            <a className="dropdown-toggle btn btn-outline-light shadow" data-bs-toggle="dropdown" href="javascript:void(0);">
                                                Marketing Pipeline
                                            </a>
                                            <div className="dropdown-menu dropdown-menu-end">
                                                <a href="javascript:void(0);" className="dropdown-item">
                                                    Marketing Pipeline
                                                </a>
                                                <a href="javascript:void(0);" className="dropdown-item">
                                                    Sales Pipeline
                                                </a>
                                                <a href="javascript:void(0);" className="dropdown-item">
                                                    Email
                                                </a>
                                                <a href="javascript:void(0);" className="dropdown-item">
                                                    Chats
                                                </a>
                                                <a href="javascript:void(0);" className="dropdown-item">
                                                    Operational
                                                </a>
                                            </div>
                                        </div>
                                        <div className="dropdown">
                                            <a className="dropdown-toggle btn btn-outline-light shadow" data-bs-toggle="dropdown" href="javascript:void(0);">
                                                Last 30 Days
                                            </a>
                                            <div className="dropdown-menu dropdown-menu-end">
                                                <a href="javascript:void(0);" className="dropdown-item">
                                                    Last 30 Days
                                                </a>
                                                <a href="javascript:void(0);" className="dropdown-item">
                                                    Last 6 months
                                                </a>
                                                <a href="javascript:void(0);" className="dropdown-item">
                                                    Last 12 months
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body py-0">
                                <div id="last-chart"></div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 d-flex">
                        <div className="card flex-fill">
                            <div className="card-header">
                                <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                                    <h6 className="mb-0">Won Deals Stage</h6>
                                    <div className="d-flex align-items-center flex-wrap row-gap-3">
                                        <div className="dropdown me-2">
                                            <a className="dropdown-toggle btn btn-outline-light shadow" data-bs-toggle="dropdown" href="javascript:void(0);">
                                                Marketing Pipeline
                                            </a>
                                            <div className="dropdown-menu dropdown-menu-end">
                                                <a href="javascript:void(0);" className="dropdown-item">
                                                    Marketing Pipeline
                                                </a>
                                                <a href="javascript:void(0);" className="dropdown-item">
                                                    Sales Pipeline
                                                </a>
                                                <a href="javascript:void(0);" className="dropdown-item">
                                                    Email
                                                </a>
                                                <a href="javascript:void(0);" className="dropdown-item">
                                                    Chats
                                                </a>
                                                <a href="javascript:void(0);" className="dropdown-item">
                                                    Operational
                                                </a>
                                            </div>
                                        </div>
                                        <div className="dropdown">
                                            <a className="dropdown-toggle btn btn-outline-light shadow" data-bs-toggle="dropdown" href="javascript:void(0);">
                                                Last 30 Days
                                            </a>
                                            <div className="dropdown-menu dropdown-menu-end">
                                                <a href="javascript:void(0);" className="dropdown-item">
                                                    Last 30 Days
                                                </a>
                                                <a href="javascript:void(0);" className="dropdown-item">
                                                    Last 6 months
                                                </a>
                                                <a href="javascript:void(0);" className="dropdown-item">
                                                    Last 12 months
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body py-0">
                                <div id="won-chart"></div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 d-flex">
                        <div className="card w-100">
                            <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                                <h6 className="mb-0">Deals by Year</h6>
                                <div className="d-flex align-items-center flex-wrap row-gap-3">
                                    <div className="dropdown me-2">
                                        <a className="dropdown-toggle btn btn-outline-light shadow" data-bs-toggle="dropdown" href="javascript:void(0);">
                                            Sales Pipeline
                                        </a>
                                        <div className="dropdown-menu dropdown-menu-end">
                                            <a href="javascript:void(0);" className="dropdown-item">
                                                Marketing Pipeline
                                            </a>
                                            <a href="javascript:void(0);" className="dropdown-item">
                                                Sales Pipeline
                                            </a>
                                        </div>
                                    </div>
                                    <div className="dropdown">
                                        <a className="dropdown-toggle btn btn-outline-light shadow" data-bs-toggle="dropdown" href="javascript:void(0);">
                                            Last 30 Days
                                        </a>
                                        <div className="dropdown-menu dropdown-menu-end">
                                            <a href="javascript:void(0);" className="dropdown-item">
                                                Last 3 months
                                            </a>
                                            <a href="javascript:void(0);" className="dropdown-item">
                                                Last 6 months
                                            </a>
                                            <a href="javascript:void(0);" className="dropdown-item">
                                                Last 12 months
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body py-0">
                                <div id="deals-year"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div >
    );
}

export default DealsDashboard;
