import React from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import "./Navigation.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function Navigation() {
  const navigate = useNavigate();

  // Check if the user is authenticated
  const isAuthenticated = !!localStorage.getItem("authToken");
  const username = localStorage.getItem("username");
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

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
          <ul className="navbar-nav mr-auto">
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <a className="nav-link" href="/Analytics">
                    Analytics
                    <i class="bi bi-bar-chart-steps chart-icon"></i>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/Conversation_history">
                    Conversation History
                    <i class="bi bi-chat-dots chat-icon"></i>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/Chat_Interface">
                    UOB Website
                    <i class="bi bi-laptop lp-icon"></i>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/TMRW_Interface">
                    TMRW App
                    <i class="bi bi-phone phone-icon"></i>
                  </a>
                </li>
              </>
            ) : null}
          </ul>

          <ul className="navbar-nav ms-auto">
            {isAuthenticated ? (
              <Dropdown>
                <Dropdown.Toggle
                  variant="outline-light"
                  id="dropdown-basic"
                  className="dropdown-toggle"
                >
                  <i className="bi bi-person-circle me-2"></i> {username}
                </Dropdown.Toggle>

                <Dropdown.Menu align="end" className="custom-dropdown-menu">
                  <Dropdown.Item href="#" className="custom-dropdown-item">
                    <i className="bi bi-gear me-2"></i> Settings
                  </Dropdown.Item>
                  <Dropdown.Item href="#" className="custom-dropdown-item">
                    <i className="bi bi-person-lines-fill me-2"></i> Profile
                    Details
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={handleLogout}
                    className="custom-dropdown-item"
                  >
                    <i className="bi bi-box-arrow-right me-2"></i> Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <li className="nav-item">
                <a className="nav-link" href="/">
                  Login
                </a>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navigation;
