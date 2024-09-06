import React from "react";
import { useState } from "react";

function ChatInterface() {
  const [data, setData] = useState([{ message: "Hello from React!" }]);
  const sendDataToBackend = async () => {
    try {
      const response = await fetch("http://localhost:3000/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // Send the data as JSON
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <button onClick={sendDataToBackend}>Send Data to Backend</button>
    </div>
  );
}

export default ChatInterface;
