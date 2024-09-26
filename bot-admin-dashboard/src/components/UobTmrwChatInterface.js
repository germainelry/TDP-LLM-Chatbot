import React, { useState, useRef, useEffect } from "react";
import UserRatings from "./UserRatings";
import "./UobTmrwChatInterface.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function UobTmrwChatInterface({ onClose }) {
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

  // Handle AI message modal toggle
  const handleMessageClick = (message) => {
    setSelectedMessage(message); // Set the clicked message as the selected one
  };

  const handleCloseMessageModal = () => {
    setSelectedMessage(null); // Close the modal by setting the selected message to null
  };

  const handleEscalate = () => {
    setActionType("Escalate"); // Set action type as "Escalate"
    setShowReasonModal(true); // Show the reason modal
  };

  const handleReport = () => {
    setActionType("Report"); // Set action type as "Report"
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
      className={`chatbot-interface-main-tmrw-app ${
        isModalOpen ? "blur-background" : ""
      }`}
    >
      <div className="chatbot-container-tmrw-app">
        <div className="chatbot-header-tmrw-app">
          <h5 className="chatbot-title-tmrw-app">
            UOB AI Chatbot <i className="bi bi-robot"></i>
          </h5>

          <button
            className="rate-bot-btn-tmrw-app"
            onClick={handleRatingsToggle}
            aria-label="Rate Bot"
          >
            <i className="bi bi-star"></i> Rate the Bot!
          </button>
        </div>

        {!userSubmitted ? (
          <form
            className="user-info-form-tmrw-app"
            onSubmit={handleUserInfoSubmit}
          >
            <h6>Please provide your details to continue:</h6>
            <div className="input-group-tmrw-app">
              <i className="bi bi-info-square-tmrw-app"></i>
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
            <div className="input-group-tmrw-app">
              <i className="bi bi-telephone-plus-tmrw-app"></i>
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
            <div className="chatbot-messages-tmrw-app">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message ${
                    message.user
                      ? "user-message-tmrw-app"
                      : "ai-message-tmrw-app"
                  }`}
                  onClick={
                    !message.user ? () => handleMessageClick(message) : null
                  }
                  style={{ cursor: !message.user ? "pointer" : "default" }}
                >
                  <div className="message-header-tmrw-app">
                    {message.user ? (
                      <i className="bi bi-person-fill"></i>
                    ) : (
                      <i id="chatbox-bot-tmrw-app" className="bi bi-robot"></i>
                    )}
                    {message.user ? " You" : " Bot"}
                  </div>
                  <div className="message-text-tmrw-app">{message.text}</div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form
              className="chatbot-input-form-tmrw-app"
              onSubmit={handleSubmit}
            >
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

      {isRatingsModalOpen && (
        <div className="modal-user-feedback-tmrw-app">
          <div className="modal-content-feedback-tmrw-app">
            <UserRatings userData={userInfo} />
            <button
              onClick={handleRatingsToggle}
              className="close-modal-btn-feedback-tmrw-app"
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
        >
          <div className="modal-dialog modal-dialog-centered feedback-modal-tmrw-app">
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
        <div className="reason-modal reason-modal-tmrw-app">
          <div className="reason-modal-content reason-modal-content-tmrw-app">
            <div className="modal-header modal-header-tmrw-app">
              <h5 className="reason-modal-title reason-modal-title-tmrw-app">
                Please provide your reason:
              </h5>
              <button
                type="button"
                className="reason-modal-close reason-modal-close-tmrw-app"
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
}

export default UobTmrwChatInterface;
