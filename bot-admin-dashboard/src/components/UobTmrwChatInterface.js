import React, { useState, useRef, useEffect } from "react";
import UserRatings from "./UserRatings";
import "./UobTmrwChatInterface.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import uobLogo from "../img/uob-logo-cleaned.png";

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
          <h6 className="chatbot-title-tmrw-app">
            <img src={uobLogo} alt="uob-logo" className="uob-logo-cleaned" />
            UOB Digital Assistant <i className="bi bi-robot"></i>
          </h6>

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
              <i className="bi bi-info-square detail-input-icon"></i>
              <input
                type="text"
                value={userInfo.name}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, name: e.target.value })
                }
                placeholder="Enter your name"
                required
                className="placeholder-tmrw-app"
              />
            </div>
            <div className="input-group-tmrw-app">
              <i className="bi bi-telephone detail-input-icon"></i>
              <input
                type="tel"
                value={userInfo.phone}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, phone: e.target.value })
                }
                placeholder="Enter your phone number"
                required
                className="placeholder-tmrw-app"
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
        <div className="modal fade show ratings-modal-tmrw-app">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleRatingsToggle}
                ></button>
              </div>
              <div className="modal-body">
                <UserRatings userData={userInfo} />
              </div>
              <div className="modal-footer">
                <button
                  onClick={handleRatingsToggle}
                  className="btn btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
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

              {(actionType === "Report" || actionType === "Escalate") && (
                <form
                  className="reason-form-tmrw-app" // Add some margin-top
                  onSubmit={handleReasonSubmit}
                >
                  <div className="mb">
                    <label
                      htmlFor="reason-input"
                      className="form-label fw-bold form-label-tmrw-app"
                    >
                      Please provide a reason:
                    </label>
                    <textarea
                      id="reason-input"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="form-control"
                      placeholder="Type your reason here..."
                      rows="1"
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary submit-btn-tmrw-app"
                  >
                    Submit
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UobTmrwChatInterface;
