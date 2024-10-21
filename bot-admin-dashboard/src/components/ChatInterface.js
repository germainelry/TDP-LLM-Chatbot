import React, { useState, useRef, useEffect } from "react";
import UserRatings from "./UserRatings"; // Keep the import for UserRatings
import ApplicationInfo from "./ApplicationInfo";
import "./ChatInterface.css";
import uobLogo from "../img/uob-logo.png";
import uobLogoWhite from "../img/uob-logo-white.png";
import uobChineseLogo from "../img/uob-chinese-logo.png";

const ChatInterface = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: "", phone: "" });
  const [userSubmitted, setUserSubmitted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isRatingsModalOpen, setIsRatingsModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showReasonModal, setShowReasonModal] = useState(false); // State to manage the reason modal

  const [reason, setReason] = useState(""); // State to manage the reason text
  const [isSliding, setIsSliding] = useState(false); // State to manage slide effect
  const [actionType, setActionType] = useState("");
  const messageModalRef = useRef(null); // Ref for the message modal

  const inputRef = useRef(null);
  const spanRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [showWelcome, setShowWelcome] = useState(false);

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;

  const suggestions = [
    "Account Balance",
    "Recent Transactions",
    "Card Activation",
    "Overseas Card Use",
    "Rewards",
    "Fee Waiver",
    "Chat with us",
  ]; // Add keyword suggestions here

    const handleSuggestionClick = async (suggestion) => {
    setInput(suggestion); // Set the input field with the clicked suggestion
  
    // Automatically send the suggestion to the backend
    const userMessage = { text: suggestion, user: true };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
  
    setLoading(true);
    const responseText = await sendDataToBackend(suggestion); // Send to backend
    setLoading(false);
  
    const aiMessage = { text: responseText, user: false };
    setMessages((prevMessages) => [...prevMessages, aiMessage]);

    setInput(""); // Clear the input field after submission
  };

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

  const sendFeedbackToBackend = async (
    username,
    userPhone,
    userInput,
    botResponse,
    feedback,
    actionType
  ) => {
    try {
      const response = await fetch("http://localhost:3000/feedbacks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          { username, userPhone, userInput, botResponse, feedback, actionType },
        ]),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      return result.result;
    } catch (error) {
      console.error("Error:", error);
      return "Error: Could not send feedback";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Hide the welcome message after the first message is sent
    if (showWelcome) setShowWelcome(false);

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
      setUserSubmitted(true); // Mark form as submitted
  
      // Add greeting message with a 2-second delay
      setTimeout(() => {
        const greetingMessage = {
          text: "Hi there! I am your UOB digital assistant. How can I assist you today?\nIf you need help in another language, just let me know!",
          user: false, // This is a bot message
        };
        setMessages((prevMessages) => [...prevMessages, greetingMessage]); // Append the greeting message
      }, 1000); // 1000ms = 1 second
    } else {
      alert("Please provide valid name and phone number");
    }
  };

  // Handle ratings modal toggle
  const handleRatingsToggle = () => {
    setIsRatingsModalOpen((prev) => !prev); // Toggle the ratings modal
  };

  // Handle AI message modal toggle
  const handleMessageClick = (message) => {
    setSelectedMessage(message); // Set the clicked message as the selected one
  };

  const handleCloseMessageModal = () => {
    setSelectedMessage(null); // Close the modal by setting the selected message to null
  };

  const handleEscalate = () => {
    setActionType("Escalate"); // Set action type as "Escalate"
    setIsSliding(true); // Start sliding the message modal
    setShowReasonModal(true); // Show the reason modal
  };

  const handleReport = () => {
    setActionType("Report"); // Set action type as "Report"
    setIsSliding(true); // Start sliding the message modal
    setShowReasonModal(true); // Show the reason modal
  };

  const handleReasonSubmit = async (e) => {
    e.preventDefault();

    if (reason.trim()) {
      // Collect the data to send to the backend
      const username = userInfo.name;
      const userPhone = userInfo.phone;
      const userInput = messages[messages.length - 2]?.text || ""; // Get the latest user input (second last message)
      const botResponse = selectedMessage?.text || ""; // Get the selected bot message as the bot response
      const feedback = reason; // Reason acts as the user feedback

      try {
        // Send the feedback to the backend
        const result = await sendFeedbackToBackend(
          username,
          userPhone,
          userInput,
          botResponse,
          feedback,
          actionType
        );
        console.log("Feedback sent successfully:", result);
        alert(`Reason submitted successfully!`); // Provide a success message to the user

        // Clear the reason and close the modals
        setReason("");
        setShowReasonModal(false);
        setIsSliding(false);
        handleCloseMessageModal();
      } catch (error) {
        // Handle error with a user-friendly message
        alert("Failed to submit reason. Please try again.");
        console.error("Error submitting reason:", error);
      }
    }
  };

  const handleCloseReasonModal = () => {
    setShowReasonModal(false); // Close the reason modal
    setIsSliding(false); // Slide back to center
  };

  // Add blur class if modal is open
  const isModalOpen = isRatingsModalOpen || selectedMessage || showReasonModal;

  // Add class for sliding
  const messageModalClass = `modal fade show ${isSliding ? "slide-left" : ""}`;

  return (
    <div
      className={`chatbot-interface-main ${
        isModalOpen ? "blur-background" : ""
      }`}
    >
      <div className="uob-main-header">
        <span className="uob-header">
          <img src={uobLogoWhite} alt="UOB Logo" className="uob-logo-header" />
          <img
            src={uobChineseLogo}
            alt="UOB Logo"
            className="uob-chinese-logo-header"
          />
        </span>
      </div>
      <div className="content-wrapper">
        <div className="app-info-section">
          <ApplicationInfo />
        </div>
        <div className="chatbot-container">
          <div className="chatbot-header">
            <h4 className="chatbot-title">
              <img src={uobLogo} alt="UOB Logo" className="uob-logo" />
              UOB Digital Assistant <i className="bi bi-robot"></i>
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
            <div class="container-form">
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
            </div>
          ) : (
            <>
              {/* {showWelcome && (
                <div className="welcome-message d-flex align-items-center justify-content-center">
                  <div className="alert alert-info text-center" role="alert">
                    <h5 className="alert-heading">
                      Welcome to UOB Digital Assistant!
                    </h5>
                    <p>
                      Hello, {userInfo.name}! How can I assist you today? Feel
                      free to ask your first question below.
                    </p>
                  </div>
                </div>
              )} */}
              <div className="chatbot-messages">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`message ${
                      message.user ? "user-message" : "ai-message"
                    }`}
                    onClick={
                      !message.user ? () => handleMessageClick(message) : null
                    }
                    style={{ cursor: !message.user ? "pointer" : "default" }}
                  >
                    <div className="message-header">
                      {message.user ? (
                        <i className="bi bi-person-fill"></i>
                      ) : (
                        <i id="chatbox-bot" className="bi bi-robot"></i>
                      )}
                      {message.user ? " You" : " Bot"}
                    </div>
                    <div className="message-text">
                      {message.text.split("\n").map((line, index) => (
                        <p key={index} style={{ margin: 0 }}>
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Interactive Keyword Suggestions */}
              <div className="suggestions-container">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="suggestion-button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    onMouseDown={(e) => e.target.classList.add("active")}
                    onMouseUp={(e) => e.target.classList.remove("active")}
                  >
                    {suggestion}
                  </button>
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
            </>
          )}
        </div>
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

      {selectedMessage && (
        <div
          className={messageModalClass}
          style={{ display: "block" }}
          ref={messageModalRef}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">AI Response</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseMessageModal}
                ></button>
              </div>
              <div className="modal-body">
                <p>{selectedMessage.text}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleEscalate}
                >
                  <i className="bi bi-person-fill"></i> Escalate (Speak to Human
                  Agent)
                </button>
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={handleReport}
                >
                  <i className="bi bi-exclamation-circle-fill"></i> Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showReasonModal && (
        <div className="reason-modal">
          <div className="reason-modal-content">
            <div className="modal-header">
              <h5 className="reason-modal-title">
                Please provide your reason:
              </h5>
              <button
                type="button"
                className="reason-modal-close"
                onClick={handleCloseReasonModal}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleReasonSubmit}>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter your reason here..."
                required
                rows="4"
              />
              <button type="submit" className="reason-modal-submit">
                Submit Reason
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
