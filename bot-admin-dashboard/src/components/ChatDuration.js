import React from "react";
import Chart from "react-apexcharts";
import "./ChatDuration.css";

function ChatDuration() {
  const yData = [5, 8, 24, 16, 32, 42, 30, 17, 11];
  const series = [
    {
      name: "visitors",
      data: Array.from({ length: yData.length }, (_, i) => ({
        x: 0.5 + i,
        y: yData[i],
        ...(i === 4
          ? { fillColor: "rgba(104, 188, 237, 0.4)", strokeColor: "#68bced" }
          : {}),
      })),
    },
  ];
  const options = {
    chart: {
      type: "bar",
    },
    plotOptions: {
      bar: {
        columnWidth: "95%",
        strokeWidth: 2,
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    fill: {
      colors: "#68ed78",
      opacity: 0.3,
    },
    stroke: {
      width: 2,
      colors: ["#68ed78"],
    },
    dataLabels: { enabled: false },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    xaxis: {
      type: "numeric",
      min: 0,
      max: yData.length,
      tickAmount: yData.length,
      labels: { formatter: (x) => x /*Math.round(x)*/ },
      title: { text: "Hours", offsetY: 70 },
      axisBorder: {
        color: "#000000",
      },
    },
    yaxis: {
      title: { text: "Visitors" },
      min: 0,
      max: Math.max(...yData),
      axisBorder: {
        show: true,
        color: "#000000",
      },
    },
    tooltip: {
      onDatasetHover: {
        highlightDataSeries: true,
      },
      x: {
        formatter: (x) => {
          return "Hours " + (x - 0.5) + "-" + (x + 0.5);
        },
      },
    },
  };
  return (
    <>
      <span id="chat-duration-title">Chat Duration Distribution</span>
      <Chart options={options} series={series} type="bar" height={160} />
    </>
  );
}

export default ChatDuration;
