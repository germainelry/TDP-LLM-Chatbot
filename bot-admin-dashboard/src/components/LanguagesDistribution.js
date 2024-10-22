import React, { useEffect, useState, useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import "./LanguagesDistribution.css";

function LanguagesDistribution() {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/languages_distribution");
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Error fetching languages distribution data:", error);
      }
    };

    fetchData();

    const interval = setInterval(() => {
      fetchData(); // Fetch data every 15 seconds
    }, 15000);

    return () => clearInterval(interval); // Clean up interval
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
    <div className="language-distribution-container">
      <span id="language-distribution-title">Top 8 Languages (by ID Code)</span>
      <div id="language-distribution-chart-container">
        {series.length > 0 ? (
          <ReactApexChart
            className="language-distribution"
            options={options}
            series={series}
            type="polarArea"
            height={315}
          />
        ) : (
          <p>Loading data...</p>
        )}
      </div>
    </div>
  );
}

export default LanguagesDistribution;
