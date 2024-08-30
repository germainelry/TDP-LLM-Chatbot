import React, { useEffect, useState, useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import "./LanguagesDistribution.css";

function LanguagesDistribution() {
  const [data, setData] = useState({});

  useEffect(() => {
    fetch("/languages_distribution")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  }, []);

  const options = useMemo(
    () => ({
      chart: {
        type: "polarArea",
        height: 350,
      },
      plotOptions: {
        polarArea: {
          rings: {
            strokeWidth: 0,
          },
          spokes: {
            strokeWidth: 0,
          },
        },
      },
      labels: Object.keys(data),
      dataLabels: {
        enabled: false,
      },
    }),
    [data]
  );

  const series = useMemo(() => Object.values(data), [data]);

  return (
    <div>
      <span id="language-distribution-title">
        Language ID Code Distribution
      </span>
      <div id="language-distribution-chart">
        {series.length > 0 ? (
          <ReactApexChart
            options={options}
            series={series}
            type="polarArea"
            height={350}
          />
        ) : (
          <p>Loading data...</p>
        )}
      </div>
    </div>
  );
}

export default LanguagesDistribution;
