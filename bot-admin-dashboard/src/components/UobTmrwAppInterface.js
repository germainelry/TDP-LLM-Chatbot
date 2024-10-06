import "./UobTmrwAppInterface.css";
import tmrw from "../img/tmrw-app.png";
import "bootstrap-icons/font/bootstrap-icons.css";
import React, { useState } from "react";
import UobTmrwChatInterface from "./UobTmrwChatInterface";
import bou from "../img/BOU.png";

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
          <img src={bou} alt="bou-robot" className="bou-icon" />
        </div>
      </div>
      {isChatOpen && <UobTmrwChatInterface onClose={handleCloseChat} />}
    </>
  );
}

export default UobTmrwAppInterface;
