import React, { useEffect, useState } from "react";
import "./ConversationHistory.css";

function ConversationHistory() {
  const [data, setData] = useState([]);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    fetch("/conversation_history")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  }, []);

  // Function to handle chat filter
  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  // Filtered info data
  const filteredData = data.filter(
    (info, index) =>
      info.input.toLowerCase().includes(filterText.toLowerCase()) ||
      info.output.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <>
      <h2>Conversation History</h2>
      <input
        type="text"
        placeholder="Filter information..."
        value={filterText}
        onChange={handleFilterChange}
      />
      <div className="conversation-container">
        <div>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
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
            ))
          ) : (
            <p>No matching information found.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default ConversationHistory;
