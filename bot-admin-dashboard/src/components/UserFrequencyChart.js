import React, { useEffect, useState } from "react";
import "./UserFrequencyChart.css";
import ReactApexChart from "react-apexcharts";

function UserFrequencyChart() {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/user_frequency_across_time");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching user frequency data:", error);
      }
    };

    fetchData();
  }, []);

  const state = {
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: Object.keys(data),
      },
    },
    series: [
      {
        name: "User Interactions",
        data: Object.values(data),
      },
    ],
    stroke: {
      width: [0, 2, 5],
      curve: "smooth",
    },
  };

  return (
    <div className="user-interactions-container">
      <span id="user-freq-title">User Interactions Across Time</span>
      <div id="user-freq-chart-container">
        <ReactApexChart
          className="user-freq-chart"
          options={state.options}
          series={state.series}
          type="area"
          height={350}
        />
      </div>
    </div>
  );
}

export default UserFrequencyChart;
