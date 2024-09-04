import React, { useState, useEffect, useRef } from "react";
import WordCloud from "wordcloud";
import "./WordCloudDisplay.css";
import CustomerSatisfaction from "./CustomerSatisfaction";
import ChatDuration from "./ChatDuration";

function WordCloudDisplay() {
  const [data, setData] = useState({
    words: {},
  });

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

  useEffect(() => {
    console.log(data); // Log the updated data whenever it changes
  }, [data]); // Depend on data to log whenever it updates

  const replacementWordList = [
    ["uob", 27],
    ["banking", 19],
    ["products", 18],
    ["привет", 14],
    ["menabung", 13],
    ["préstamo", 13],
    ["借款", 13],
    ["überweisen", 13],
    ["offer", 13],
    ["ceo", 11],
    ["savings", 11],
    ["account", 11],
    ["singapore", 6],
    ["set", 6],
    ["indonesian", 5],
    ["spanish", 5],
    ["bank", 5],
    ["loan", 7],
    ["customer", 8],
    ["service", 9],
    ["currency", 4],
    ["investment", 7],
    ["信用", 6],
    ["تحويل", 5],
    ["kredit", 17],
    ["monnaie", 14],
    ["クレジット", 6],
  ];
  const wordList = replacementWordList;
  // Ensure words is an object and has entries
  // const wordList =
  //   typeof data === "object" ? Object.entries(data) : replacementWordList;

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
