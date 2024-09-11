import React, { useState, useEffect, useRef } from "react";
import WordCloud from "wordcloud";
import "./WordCloudDisplay.css";
import CustomerSatisfaction from "./CustomerSatisfaction";

function WordCloudDisplay() {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/most_searched_terms");
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Error fetching most searched terms data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/most_searched_terms");
        const result = await response.json();
        setData(result); // This updates the state with the fetched result
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Call the async function
  }, []);

  const replacement = [];

  // Ensure words is an object and has entries
  const wordList =
    typeof data === "object" ? Object.entries(data) : replacement;

  const canvasRef = useRef(null);
  useEffect(() => {
    if (canvasRef.current && wordList.length > 0) {
      WordCloud(canvasRef.current, {
        list: wordList,
        gridSize: Math.round((40 * canvasRef.current.offsetWidth) / 1024),
        weightFactor: function (size) {
          return (size * 3 * canvasRef.current.offsetWidth) / 1024;
        },
        fontFamily: "Helvetica Neue, sans-serif",
        color: "random-dark",
        rotateRatio: 0.5,
        rotationSteps: 2,
        backgroundColor: "#ffffff",
      });
    }
  }, [wordList]);

  return (
    <>
      <div className="customer-metrics">
        <div className="word-cloud">
          <span id="word-cloud-title">Word Cloud Example</span>
          <canvas
            id="word-cloud-display"
            ref={canvasRef}
            width={540}
            height={150}
          />
        </div>
        <div>
          <CustomerSatisfaction />
        </div>
      </div>
    </>
  );
}

export default WordCloudDisplay;
