import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import "./TopicTagging.css";

function TopicTagging() {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/topic_tagging");
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Error fetching most topic tagging:", error);
      }
    };

    fetchData();
  }, []);

  const queryData = Object.entries(data).map((entry) => ({
    x: entry[0],
    y: entry[1],
  }));

  console.log(queryData);
  const mainData = {
    series: [
      {
        data: queryData,
      },
    ],
    options: {
      legend: {
        show: false,
      },
      chart: {
        type: "treemap",
      },
      colors: [
        "#3B93A5",
        "#F7B844",
        "#ADD8C7",
        "#EC3C65",
        "#CDD7B6",
        "#C1F666",
        "#D43F97",
        "#1E5D8C",
        "#421243",
        "#7F94B0",
        "#EF6537",
        "#C0ADDB",
      ],
      plotOptions: {
        treemap: {
          distributed: true,
          enableShades: false,
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: 20, // Increase data label font size
        },
      },
    },
  };

  return (
    <>
      <div className="tree-chart">
        <span className="tree-chart-title">Topics Enquired by Users</span>
        <ReactApexChart
          options={mainData.options}
          series={mainData.series}
          type="treemap"
          height={375}
          width={430}
          className="apex-tree-chart"
        />
      </div>
    </>
  );
}

export default TopicTagging;
