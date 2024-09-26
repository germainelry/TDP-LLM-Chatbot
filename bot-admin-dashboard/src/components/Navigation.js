import React from "react";
import "./Navigation.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function Navigation() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-blue">
        <h1 className="main-header navbar-brand">
          LLM Chatbot Admin Dashboard
          <i className="bi bi-telegram"></i>
          <i className="bi bi-robot"></i>
        </h1>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item active">
              <a className="nav-link" href="/">
                Analytics <span className="sr-only">(current)</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/Conversation_history">
                Conversation History
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/Chat_Interface">
                Chatbot Interface
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/TMRW_Interface">
                UOB TMRW Chatbot Interface
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/Login">
                Login
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navigation;
