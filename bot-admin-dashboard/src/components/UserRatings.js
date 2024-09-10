import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import "./UserRatings.css"; // Import the external CSS file

function UserRatings() {
  const colors = {
    orange: "#FFBA5A",
    grey: "#a9a9a9",
  };

  const [currentValue, setCurrentValue] = useState(0); // To track rating
  const [hoverValue, setHoverValue] = useState(undefined); // For hover effect on stars
  const [feedback, setFeedback] = useState(""); // To track user feedback
  const [isSubmitted, setIsSubmitted] = useState(false);
  const stars = Array(5).fill(0);

  // Handle click on stars to set rating
  const handleClick = (value) => {
    setCurrentValue(value);
  };

  // Handle mouse over for star hover effect
  const handleMouseOver = (newHoverValue) => {
    setHoverValue(newHoverValue);
  };

  // Handle mouse leave to reset hover effect
  const handleMouseLeave = () => {
    setHoverValue(undefined);
  };

  // Handle feedback input change
  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
  };

  // Handle submit button click
  const handleSubmit = async () => {
    if (currentValue > 0 && feedback.trim()) {
      await sendDataToBackend(currentValue, feedback);
      setIsSubmitted(true);

      // Optionally clear the form after submission
      setCurrentValue(0);
      setFeedback("");

      // Hide the success message after 3 seconds
      setTimeout(() => setIsSubmitted(false), 3000);
    } else {
      alert("Please provide a rating and feedback.");
    }
  };

  const sendDataToBackend = async (ratings, feedback) => {
    try {
      const response = await fetch("http://localhost:3000/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([{ ratings, feedback }]), // Send user info along with message
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      return result.result;
    } catch (error) {
      console.error("Error:", error);
      return "Error: Could not get response";
    }
  };

  return (
    <div className="ratings-container">
      <h3>Chatbot Experience Ratings</h3>

      {/* Success message */}
      {isSubmitted && (
        <div
          className={`alert alert-success fade ${
            isSubmitted ? "show" : ""
          } success-message`}
        >
          <p>Thank you for your feedback!</p>
        </div>
      )}

      <div className="ratings-stars">
        {stars.map((_, index) => {
          return (
            <FaStar
              className="ratings-star"
              key={index}
              size={24}
              onClick={() => handleClick(index + 1)}
              onMouseOver={() => handleMouseOver(index + 1)}
              onMouseLeave={handleMouseLeave}
              color={
                (hoverValue || currentValue) > index
                  ? colors.orange
                  : colors.grey
              }
            />
          );
        })}
      </div>
      <textarea
        placeholder="What's your experience?"
        className="ratings-textarea"
        value={feedback}
        onChange={handleFeedbackChange}
      />
      <button className="ratings-button" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}

export default UserRatings;
