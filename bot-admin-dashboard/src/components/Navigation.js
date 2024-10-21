import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown, Modal, Button } from "react-bootstrap";
import "./Navigation.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function Navigation() {
  const navigate = useNavigate();

  // State for the user profile modal
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [user, setUser] = useState({
    username: localStorage.getItem("username") || "",
    email: localStorage.getItem("email") || "",
    contactNo: "", // Add contactNo here
    joinedDate: "2021-01-15", // Sample joined date
  });

  // Check if the user is authenticated
  const isAuthenticated = !!localStorage.getItem("authToken");

  // Fetch user profile
  const userProfile = async (username) => {
    try {
      const response = await fetch("http://localhost:3000/fetchUserProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user profile.");
      }

      const result = await response.json();

      // Update local storage
      localStorage.setItem("username", result.username);
      localStorage.setItem("email", result.email);
      setUser((prevState) => ({
        ...prevState,
        username: result.username,
        email: result.email,
        contactNo: result.contactNo, // Set contactNo from response
      }));
    } catch (error) {
      console.error("Error:", error);
      window.alert("Failed to fetch user profile: " + error.message);
    }
  };

  // Load user profile when component mounts
  useEffect(() => {
    if (isAuthenticated && user.username) {
      userProfile(user.username);
    }
  }, [isAuthenticated, user.username]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  // User Profile Modal
  const UserProfileModal = () => (
    <Modal
      show={showProfileModal}
      onHide={() => setShowProfileModal(false)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>User Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <strong>Username:</strong> {user.username}
        </div>
        <div>
          <strong>Email:</strong> {user.email}
        </div>
        <div>
          <strong>Contact No:</strong> {user.contactNo || "N/A"}
        </div>
        <div>
          <strong>Joined Date:</strong> {user.joinedDate}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowProfileModal(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-blue">
        <h1 className="main-header navbar-brand">
          BOU Chatbot Admin Dashboard
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
                    <i className="bi bi-bar-chart-steps chart-icon"></i>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/Conversation_history">
                    Conversation History
                    <i className="bi bi-chat-dots chat-icon"></i>
                  </a>
                </li>
              </>
            ) : null}

            <li className="nav-item">
              <a className="nav-link" href="/Chat_Interface">
                UOB Website
                <i className="bi bi-laptop lp-icon"></i>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/TMRW_Interface">
                TMRW App
                <i className="bi bi-phone phone-icon"></i>
              </a>
            </li>
          </ul>

          <ul className="navbar-nav ms-auto">
            {isAuthenticated ? (
              <>
                <Dropdown>
                  <Dropdown.Toggle
                    variant="outline-light"
                    id="dropdown-basic"
                    className="dropdown-toggle"
                    style={{ fontSize: "1.25rem" }}
                  >
                    <i
                      className="bi bi-person-circle me-1"
                      style={{ fontSize: "1.5rem" }}
                    ></i>
                    <span style={{ fontSize: "1.25rem" }}>{user.username}</span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu align="end" className="custom-dropdown-menu">
                    <Dropdown.Item href="#" className="custom-dropdown-item">
                      <i className="bi bi-gear me-2"></i>
                      Settings
                    </Dropdown.Item>
                    <Dropdown.Item
                      href="#"
                      className="custom-dropdown-item"
                      onClick={() => setShowProfileModal(true)}
                    >
                      <i className="bi bi-person-lines-fill me-2"></i>
                      Profile Details
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={handleLogout}
                      className="custom-dropdown-item"
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                <UserProfileModal />
              </>
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
