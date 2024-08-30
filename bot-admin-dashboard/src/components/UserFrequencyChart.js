import React, { useEffect, useState } from "react";
import "./UserFrequencyChart.css";
import ApexCharts from "apexcharts";
import ReactApexChart from "react-apexcharts";

function UserFrequencyChart() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch("/user_frequency_across_time")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
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
        name: "series-1",
        data: Object.values(data),
      },
    ],
  };
  return (
    <div>
      <span id="user-freq-title">User Interactions Across Time</span>
      <div id="user-freq-chart">
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="bar"
          height={350}
        />
      </div>
    </div>
  );
}

export default UserFrequencyChart;
