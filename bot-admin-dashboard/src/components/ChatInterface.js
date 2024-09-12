// import React, { useState, useRef, useEffect } from "react";
// import UserRatings from "./UserRatings"; // Keep the import for UserRatings
// import "./ChatInterface.css";

// const ChatInterface = () => {
//   const [input, setInput] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [userInfo, setUserInfo] = useState({ name: "", phone: "" });
//   const [userSubmitted, setUserSubmitted] = useState(false);
//   const [isListening, setIsListening] = useState(false);
//   const [isRatingsModalOpen, setIsRatingsModalOpen] = useState(false);
//   const [selectedMessage, setSelectedMessage] = useState(null);
//   const [showReasonModal, setShowReasonModal] = useState(false); // State to manage the reason modal
//   const [reason, setReason] = useState(""); // State to manage the reason text

//   const inputRef = useRef(null);
//   const spanRef = useRef(null);
//   const messagesEndRef = useRef(null);

//   const SpeechRecognition =
//     window.SpeechRecognition || window.webkitSpeechRecognition;

//   const recognition = new SpeechRecognition();
//   recognition.continuous = false;
//   recognition.interimResults = false;

//   recognition.onresult = (event) => {
//     const speechResult = event.results[0][0].transcript;
//     setInput(speechResult);
//     setIsListening(false);
//   };

//   recognition.onend = () => {
//     setIsListening(false);
//   };

//   const handleSpeechToText = () => {
//     if (isListening) {
//       recognition.stop();
//     } else {
//       recognition.start();
//       setIsListening(true);
//     }
//   };

//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages]);

//   useEffect(() => {
//     if (inputRef.current && spanRef.current) {
//       const spanWidth = spanRef.current.offsetWidth;
//       inputRef.current.style.width = `${Math.min(spanWidth + 20, 300)}px`;
//     }
//   }, [input]);

//   const sendDataToBackend = async (message) => {
//     try {
//       const response = await fetch("http://localhost:3000/chatbot", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify([{ message, userInfo }]),
//       });

//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }

//       const result = await response.json();
//       return result.result;
//     } catch (error) {
//       console.error("Error:", error);
//       return "Error: Could not get response";
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     const userMessage = { text: input, user: true };
//     setMessages((prevMessages) => [...prevMessages, userMessage]);
//     setInput("");

//     setLoading(true);
//     const responseText = await sendDataToBackend(input);
//     setLoading(false);

//     const aiMessage = { text: responseText, user: false };
//     setMessages((prevMessages) => [...prevMessages, aiMessage]);
//   };

//   const handleUserInfoSubmit = (e) => {
//     e.preventDefault();
//     if (userInfo.name.trim() && userInfo.phone.trim()) {
//       setUserSubmitted(true);
//     } else {
//       alert("Please provide valid name and phone number");
//     }
//   };

//   // Handle ratings modal toggle
//   const handleRatingsToggle = () => {
//     setIsRatingsModalOpen((prev) => !prev); // Toggle the ratings modal
//   };

//   // Handle AI message modal toggle
//   const handleMessageClick = (message) => {
//     setSelectedMessage(message); // Set the clicked message as the selected one
//   };

//   const handleCloseMessageModal = () => {
//     setSelectedMessage(null); // Close the modal by setting the selected message to null
//   };

//   // Handle the Escalate action
//   const handleEscalate = () => {
//     setShowReasonModal(true); // Show the reason modal
//     handleCloseMessageModal(); // Close the current modal
//   };

//   // Handle the Report action
//   const handleReport = () => {
//     setShowReasonModal(true); // Show the reason modal
//     handleCloseMessageModal(); // Close the current modal
//   };

//   // Handle reason submission
//   const handleReasonSubmit = (e) => {
//     e.preventDefault();
//     alert(`Reason submitted: ${reason}`);
//     setReason(""); // Clear the reason input
//     setShowReasonModal(false); // Close the reason modal
//   };

//   // Add blur class if modal is open
//   const isModalOpen = isRatingsModalOpen || selectedMessage || showReasonModal;

//   return (
//     <div
//       className={`chatbot-interface-main ${
//         isModalOpen ? "blur-background" : ""
//       }`}
//     >
//       <div className="chatbot-container">
//         <div className="chatbot-header">
//           <h4 className="chatbot-title">
//             Interact with our Custom AI Chatbot <i className="bi bi-robot"></i>
//           </h4>

//           <button
//             className="rate-bot-btn"
//             onClick={handleRatingsToggle}
//             aria-label="Rate Bot"
//           >
//             <i className="bi bi-star"></i> Rate the Bot!
//           </button>
//         </div>

//         {!userSubmitted ? (
//           <form className="user-info-form" onSubmit={handleUserInfoSubmit}>
//             <h6>Please provide your details to continue:</h6>
//             <div className="input-group">
//               <i className="bi bi-info-square"></i>
//               <input
//                 type="text"
//                 value={userInfo.name}
//                 onChange={(e) =>
//                   setUserInfo({ ...userInfo, name: e.target.value })
//                 }
//                 placeholder="Enter your name"
//                 required
//               />
//             </div>
//             <div className="input-group">
//               <i className="bi bi-telephone-plus"></i>
//               <input
//                 type="tel"
//                 value={userInfo.phone}
//                 onChange={(e) =>
//                   setUserInfo({ ...userInfo, phone: e.target.value })
//                 }
//                 placeholder="Enter your phone number"
//                 required
//               />
//             </div>

//             <button type="submit">Submit</button>
//           </form>
//         ) : (
//           <>
//             <div className="chatbot-messages">
//               {messages.map((message, index) => (
//                 <div
//                   key={index}
//                   className={`message ${
//                     message.user ? "user-message" : "ai-message"
//                   }`}
//                   onClick={
//                     !message.user ? () => handleMessageClick(message) : null
//                   }
//                   style={{ cursor: !message.user ? "pointer" : "default" }}
//                 >
//                   <div className="message-header">
//                     {message.user ? (
//                       <i className="bi bi-person-fill"></i>
//                     ) : (
//                       <i id="chatbox-bot" className="bi bi-robot"></i>
//                     )}
//                     {message.user ? " You" : " Bot"}
//                   </div>
//                   <div className="message-text">{message.text}</div>
//                 </div>
//               ))}
//               <div ref={messagesEndRef} />
//             </div>

//             <form className="chatbot-input-form" onSubmit={handleSubmit}>
//               <input
//                 ref={inputRef}
//                 type="text"
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 placeholder="Type your message..."
//                 className="chat-input"
//               />
//               <button
//                 type="button"
//                 onClick={handleSpeechToText}
//                 className={`voice-btn ${isListening ? "listening" : ""}`}
//               >
//                 {isListening ? "Listening..." : <i className="bi bi-mic"></i>}
//               </button>
//               <button type="submit" disabled={loading}>
//                 {loading ? "Sending..." : "Send"}
//               </button>
//             </form>
//           </>
//         )}
//       </div>

//       {isRatingsModalOpen && (
//         <div className="modal-user-feedback">
//           <div className="modal-content-feedback">
//             <UserRatings userData={userInfo} />
//             <button
//               onClick={handleRatingsToggle}
//               className="close-modal-btn-feedback"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       {selectedMessage && (
//         <div
//           className="modal fade show"
//           style={{ display: "block", transition: "transform 1s" }}
//           tabIndex="-1"
//         >
//           <div className="modal-dialog modal-dialog-centered">
//             <div
//               className="modal-content"
//               style={{ transition: "transform 1s" }}
//             >
//               <div className="modal-header">
//                 <h5 className="modal-title">AI Response</h5>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   onClick={handleCloseMessageModal}
//                 ></button>
//               </div>
//               <div className="modal-body">
//                 <p>{selectedMessage.text}</p>
//               </div>
//               <div className="modal-footer">
//                 <button
//                   type="button"
//                   className="btn btn-primary"
//                   onClick={handleEscalate}
//                 >
//                   <i className="bi bi-person-fill"></i> Escalate (Speak to Human
//                   Agent)
//                 </button>
//                 <button
//                   type="button"
//                   className="btn btn-warning"
//                   onClick={handleReport}
//                 >
//                   <i className="bi bi-exclamation-circle-fill"></i> Report
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {showReasonModal && (
//         <div className={`reason-modal ${showReasonModal ? "show" : ""}`}>
//           <div className="reason-modal-content">
//             <h5>Please provide your reason:</h5>
//             <form onSubmit={handleReasonSubmit}>
//               <textarea
//                 value={reason}
//                 onChange={(e) => setReason(e.target.value)}
//                 placeholder="Enter your reason here..."
//                 required
//                 rows="4"
//               />
//               <button type="submit">Submit Reason</button>
//               <button
//                 type="button"
//                 onClick={() => setShowReasonModal(false)}
//                 className="btn-close"
//               >
//                 Close
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatInterface;

import React, { useState, useRef, useEffect } from "react";
import UserRatings from "./UserRatings"; // Keep the import for UserRatings
import "./ChatInterface.css";

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

  // Handle AI message modal toggle
  const handleMessageClick = (message) => {
    setSelectedMessage(message); // Set the clicked message as the selected one
  };

  const handleCloseMessageModal = () => {
    setSelectedMessage(null); // Close the modal by setting the selected message to null
  };

  const handleEscalate = () => {
    setIsSliding(true); // Start sliding the message modal
    setShowReasonModal(true); // Show the reason modal
  };

  const handleReport = () => {
    setIsSliding(true); // Start sliding the message modal
    setShowReasonModal(true); // Show the reason modal
  };

  const handleReasonSubmit = (e) => {
    e.preventDefault();
    if (reason.trim()) {
      alert(`Reason submitted: ${reason}`);
      setReason(""); // Clear the reason
      setShowReasonModal(false); // Close the reason modal
      setIsSliding(false); // Reset sliding state
      handleCloseMessageModal(); // Close the message modal
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
