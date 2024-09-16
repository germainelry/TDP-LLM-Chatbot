import React, { useEffect, useState } from "react";
import "./UserFrequencyChart.css";
import ReactApexChart from "react-apexcharts";
import { format, parseISO, eachDayOfInterval } from "date-fns";

function UserFrequencyChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/user_frequency_across_time");
        const result = await response.json();
        const filledData = fillMissingDates(result);
        setData(filledData);
      } catch (error) {
        console.error("Error fetching user frequency data:", error);
      }
    };

    fetchData();
  }, []);

  // Helper function to fill in missing dates with frequency 0
  const fillMissingDates = (rawData) => {
    const parsedData = Object.entries(rawData).map(([date, freq]) => ({
      date: parseISO(date),
      freq: freq,
    }));

    // Find the minimum and maximum dates
    const minDate = parsedData[0].date;
    const maxDate = parsedData[parsedData.length - 1].date;

    // Generate all dates in the range
    const allDates = eachDayOfInterval({ start: minDate, end: maxDate });

    // Fill missing dates with frequency 0
    const filledData = allDates.reduce((acc, currentDate) => {
      const foundEntry = parsedData.find(
        (entry) => entry.date.getTime() === currentDate.getTime()
      );
      acc[format(currentDate, "yyyy-MM-dd")] = foundEntry ? foundEntry.freq : 0;
      return acc;
    }, {});

    return filledData;
  };

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
