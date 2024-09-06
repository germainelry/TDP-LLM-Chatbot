import React, { useState, useRef, useEffect } from "react";
import "./ChatInterface.css";

const ChatInterface = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);
  const spanRef = useRef(null);

  useEffect(() => {
    if (inputRef.current && spanRef.current) {
      const spanWidth = spanRef.current.offsetWidth;
      inputRef.current.style.width = `${spanWidth + 20}px`;
    }
  }, [input]);

  const sendDataToBackend = async (message) => {
    try {
      const response = await fetch("http://localhost:3000/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([{ message }]),
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, user: true };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");

    const responseText = await sendDataToBackend(input);
    const aiMessage = { text: responseText, user: false };
    setMessages((prevMessages) => [...prevMessages, aiMessage]);
  };

  return (
    <div>
      <button
        className="btn btn-primary float-right"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
        }}
      >
        <i className="bi bi-chat"></i>
      </button>

      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <h5>
              Interact with our Custom AI Chatbot
              <i class="bi bi-robot"></i>
            </h5>

            <button
              className="close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close Chat"
            >
              &times;
            </button>
          </div>
          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${
                  message.user ? "user-message" : "ai-message"
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>
          <form className="chatbot-input-form" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="chat-input"
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
