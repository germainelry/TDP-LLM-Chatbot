import React, { useState, useRef, useEffect } from "react";
import UserRatings from "./UserRatings"; // Keep the import for UserRatings
import "./ChatInterface.css";

const ChatInterface = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(true); // Set to true to display chat interface on load
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: "", phone: "" });
  const [userSubmitted, setUserSubmitted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isRatingsModalOpen, setIsRatingsModalOpen] = useState(false); // State to manage Ratings modal

  const inputRef = useRef(null);
  const spanRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Speech Recognition setup
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const speechResult = event.results[0][0].transcript;
    setInput(speechResult);
    setIsListening(false);
  };

  recognition.onend = () => {
    setIsListening(false);
  };

  const handleSpeechToText = () => {
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (inputRef.current && spanRef.current) {
      const spanWidth = spanRef.current.offsetWidth;
      inputRef.current.style.width = `${Math.min(spanWidth + 20, 300)}px`;
    }
  }, [input]);

  const sendDataToBackend = async (message) => {
    try {
      const response = await fetch("http://localhost:3000/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([{ message, userInfo }]),
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

    setLoading(true);
    const responseText = await sendDataToBackend(input);
    setLoading(false);

    const aiMessage = { text: responseText, user: false };
    setMessages((prevMessages) => [...prevMessages, aiMessage]);
  };

  const handleUserInfoSubmit = (e) => {
    e.preventDefault();
    if (userInfo.name.trim() && userInfo.phone.trim()) {
      setUserSubmitted(true);
    } else {
      alert("Please provide valid name and phone number");
    }
  };

  // Handle ratings modal toggle
  const handleRatingsToggle = () => {
    setIsRatingsModalOpen((prev) => !prev); // Toggle the ratings modal
  };

  return (
    <div className="chatbot-interface-main">
      <div className="chatbot-container">
        <div className="chatbot-header">
          <h4 className="chatbot-title">
            Interact with our Custom AI Chatbot <i className="bi bi-robot"></i>
          </h4>

          <button
            className="rate-bot-btn"
            onClick={handleRatingsToggle}
            aria-label="Rate Bot"
          >
            <i className="bi bi-star"></i> Rate the Bot!
          </button>
        </div>

        {!userSubmitted ? (
          <form className="user-info-form" onSubmit={handleUserInfoSubmit}>
            <h6>Please provide your details to continue:</h6>
            <div className="input-group">
              <i className="bi bi-info-square"></i>
              <input
                type="text"
                value={userInfo.name}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, name: e.target.value })
                }
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="input-group">
              <i className="bi bi-telephone-plus"></i>
              <input
                type="tel"
                value={userInfo.phone}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, phone: e.target.value })
                }
                placeholder="Enter your phone number"
                required
              />
            </div>

            <button type="submit">Submit</button>
          </form>
        ) : (
          <>
            <div className="chatbot-messages">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message ${
                    message.user ? "user-message" : "ai-message"
                  }`}
                >
                  <div className="message-header">
                    {message.user ? (
                      <i className="bi bi-person-fill"></i>
                    ) : (
                      <i id="chatbox-bot" className="bi bi-robot"></i>
                    )}
                    {message.user ? " You" : " Bot"}
                  </div>
                  <div className="message-text">{message.text}</div>
                </div>
              ))}
              <div ref={messagesEndRef} />
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
              <button
                type="button"
                onClick={handleSpeechToText}
                className={`voice-btn ${isListening ? "listening" : ""}`}
              >
                {isListening ? "Listening..." : <i className="bi bi-mic"></i>}
              </button>
              <button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send"}
              </button>
            </form>

            {/* Button to toggle Ratings modal */}
            <button
              onClick={handleRatingsToggle}
              className="btn btn-secondary"
              style={{ marginTop: "10px" }}
            >
              Rate your experience
            </button>
          </>
        )}
      </div>

      {isRatingsModalOpen && (
        <div className="modal-user-feedback">
          <div className="modal-content-feedback">
            <UserRatings userData={userInfo} />
            <button
              onClick={handleRatingsToggle}
              className="close-modal-btn-feedback"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
