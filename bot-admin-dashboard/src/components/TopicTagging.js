import React from "react";
import ReactApexChart from "react-apexcharts";
import "./TopicTagging.css";

function TopicTagging() {
  const data = {
    series: [
      {
        data: [
          {
            x: "Investment",
            y: 149,
          },
          {
            x: "Loans",
            y: 284,
          },
          {
            x: "Savings Account",
            y: 55,
          },
          {
            x: "Interest Rates",
            y: 134,
          },
          {
            x: "Others",
            y: 70,
          },
          {
            x: "Credit/Debit Cards",
            y: 40,
          },
          {
            x: "Mobile Banking",
            y: 44,
          },
          {
            x: "Bank Transfers",
            y: 68,
          },
          {
            x: "Online Banking",
            y: 19,
          },
        ],
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
          options={data.options}
          series={data.series}
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
