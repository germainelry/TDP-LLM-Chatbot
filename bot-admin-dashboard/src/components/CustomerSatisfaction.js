import React from "react";
import { useState, useEffect } from "react";
import ReactSpeedometer from "react-d3-speedometer";
import "./CustomerSatisfaction.css";

function CustomerSatisfaction() {
  const [data, setData] = useState({});

  useEffect(() => {
    fetch("/user_ratings")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        console.log(data);
      });
  }, []);

  const rating = data.ratings ? parseFloat(data.ratings.toFixed(2)) : 0;

  return (
    <>
      <div className="customer-satisfaction">
        <span id="customer-satisfaction-title">Customer Satisfaction</span>
        <ReactSpeedometer
          className="speedometer"
          maxValue={5}
          value={rating}
          needleColor="black"
          startColor="red"
          width={250}
          height={151}
          needleHeightRatio={0.7}
          endColor="green"
          needleTransitionDuration={1500}
          currentValueText={`Rating (1-5): ${rating}`}
          customSegmentLabels={[
            {
              text: "Very Bad",
              position: "OUTSIDE",
              color: "#555",
              fontSize: "10px",
            },
            {
              text: "Bad",
              position: "OUTSIDE",
              color: "#555",
              fontSize: "10px",
            },
            {
              text: "Ok",
              position: "OUTSIDE",
              color: "#555",
              fontSize: "10px",
            },
            {
              text: "Good",
              position: "OUTSIDE",
              color: "#555",
              fontSize: "10px",
            },
            {
              text: "Very Good",
              position: "OUTSIDE",
              color: "#555",
              fontSize: "10px",
            },
          ]}
        />
      </div>
    </>
  );
}

export default CustomerSatisfaction;
