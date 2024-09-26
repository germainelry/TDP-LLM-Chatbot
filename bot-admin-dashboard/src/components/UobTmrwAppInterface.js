import "./UobTmrwAppInterface.css";
import tmrw from "../img/tmrw-app.png";
import "bootstrap-icons/font/bootstrap-icons.css";
import React, { useState } from "react";
import UobTmrwChatInterface from "./UobTmrwChatInterface";

function UobTmrwAppInterface() {
  const [isChatOpen, setChatOpen] = useState(false);

  const handleRobotClick = () => {
    setChatOpen((prev) => !prev); // Toggle chat interface on icon click
  };

  const handleCloseChat = () => {
    setChatOpen(false); // Close chat interface on close button click
  };

  return (
    <>
      <div className="tmrw-app-main">
        <img src={tmrw} alt="UOB Logo" className="tmrw-app" />
        <div className="pulsing-background" onClick={handleRobotClick}>
          <i class="bi bi-chat-dots-fill robot-icon-app"></i>
        </div>
      </div>
      {isChatOpen && <UobTmrwChatInterface onClose={handleCloseChat} />}
    </>
  );
}

export default UobTmrwAppInterface;
