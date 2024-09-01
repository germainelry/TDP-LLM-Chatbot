import React, { useState, useEffect, useRef } from "react";
import WordCloud from "wordcloud";
import "./WordCloudDisplay.css";
import { Link } from "react-router-dom";

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
    ["offer", 13],
    ["ceo", 11],
    ["savings", 11],
    ["account", 11],
    ["translate", 9],
    ["hello", 9],
    ["text", 8],
    ["explain", 7],
    ["tell", 6],
    ["french", 6],
    ["language", 6],
    ["singapore", 6],
    ["set", 6],
    ["indonesian", 5],
    ["write", 5],
    ["spanish", 5],
    ["bank", 5],
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
        gridSize: Math.round((16 * canvasRef.current.offsetWidth) / 1024),
        weightFactor: function (size) {
          return (size * 2 * canvasRef.current.offsetWidth) / 1024;
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
      <div>
        <span id="word-cloud-title">Word Cloud Example</span>
        <div>
          <canvas id="word-cloud" ref={canvasRef} width={830} height={150} />
        </div>
      </div>
    </>
  );
}

export default WordCloudDisplay;
