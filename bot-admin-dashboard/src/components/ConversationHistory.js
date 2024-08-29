import React, { useEffect, useState } from "react";
import "./ConversationHistory.css";

function ConversationHistory() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch("/conversation_history")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  }, []);
  return (
    <div>
      {data.map((item, index) => (
        <div className="conversation-box">
          <p key={index}>
            {Object.entries(item).map(([key, value]) => (
              <span key={key}>
                <strong>{key}:</strong> {value}
                <br />
              </span>
            ))}
          </p>
        </div>
      ))}
    </div>
  );
}

export default ConversationHistory;
