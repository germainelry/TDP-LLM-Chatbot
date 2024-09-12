import React from "react";
import Chart from "react-apexcharts";
import "./ChatDuration.css";
import { useState, useEffect } from "react";

function ChatDuration() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/chat_duration_per_user");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching chat duration data:", error);
      }
    };

    fetchData();
  }, []);

  // Function to bin data in intervals of 5 minutes
  const binData = (data) => {
    const bins = Array.from({ length: 20 }, () => 0); // Assuming bins from 0 to 100 minutes (20 bins of 5 minutes each)

    Object.values(data).forEach((durations) => {
      durations.forEach((duration) => {
        const binIndex = Math.min(Math.floor(duration / 5), bins.length - 1);
        bins[binIndex]++;
      });
    });

    return bins;
  };

  const binnedData = binData(data);
  const series = [
    {
      name: "No of Users",
      data: binnedData.map((count, i) => ({
        x: `${i * 5}-${(i + 1) * 5} min`,
        y: count,
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
      type: "category",
      labels: {
        formatter: (val) => val,
      },
      title: { text: "Duration (Minutes)", offsetY: 70 },
      axisBorder: {
        color: "#000000",
      },
    },
    yaxis: {
      title: { text: "Frequency" },
      min: 0,
      max: Math.max(...binnedData) + 5,
      axisBorder: {
        show: true,
        color: "#000000",
      },
      labels: {
        formatter: (val) => Math.round(val),
      },
    },
    tooltip: {
      onDatasetHover: {
        highlightDataSeries: true,
      },
      x: {
        formatter: (x) => {
          return "Minutes " + x;
        },
      },
    },
  };

  return (
    <>
      <span id="chat-duration-title">Chat Duration Distribution</span>
      <Chart
        className="chat-duration-chart"
        options={options}
        series={series}
        type="bar"
        height={335}
      />
    </>
  );
}

export default ChatDuration;
