import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Dropdown from "react-bootstrap/Dropdown";
import { Offcanvas, Form } from "react-bootstrap";

import "./ConversationHistory.css";

function UserInformation(props) {
  const { show, onHide, selectedItem } = props;

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          User Information <i className="bi bi-person"></i>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedItem ? (
          <>
            <div className="d-flex align-items-center mb-2">
              <i className="bi bi-person-badge-fill me-2"></i>
              <p className="mb-0">
                <b>Username:</b> {selectedItem.username}
              </p>
            </div>
            <div className="d-flex align-items-center mb-2">
              <i className="bi bi-translate me-2"></i>
              <p className="mb-0">
                <b>Language Code of Message:</b> {selectedItem.language_code}
              </p>
            </div>
          </>
        ) : (
          <p>No user information available.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

function SessionModal({ show, onHide, selectedDate, selectedUsername }) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      className="session-modal"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Session Logs for {selectedUsername} on {selectedDate}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Centered Modal</h4>
        <p>
          Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
          dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
          consectetur ac, vestibulum at eros.
        </p>
      </Modal.Body>
    </Modal>
  );
}

function ConversationHistory() {
  const [data, setData] = useState([]);
  const [sessionLogs, setSessionLogs] = useState({});
  const [sessionNames, setSessionNames] = useState([]);
  const [sessionDates, setSessionDates] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [sessionModalShow, setSessionModalShow] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [sortOrder, setSortOrder] = useState("oldest");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedUsername, setSelectedUsername] = useState("");

  // Session response modal
  const handleModalShow = () => setSessionModalShow(true);
  const handleModalClose = () => setSessionModalShow(false);

  // Selected User Modal
  const [showSelectedUserModal, setShowSelectedUserModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/conversation_history");
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Error fetching conversation history:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await fetch("/conversation_flow");
        const data = await response.json();
        const sortedDate = data["dates"].sort(
          (a, b) => new Date(b) - new Date(a)
        );
        setSessionDates(sortedDate);
      } catch (error) {
        console.error("Error fetching session history:", error);
      }
    };

    fetchSessionData();
  }, []);

  const sendDateToBackend = async () => {
    if (!selectedDate) {
      alert("Please select a date before proceeding.");
      return;
    }

    try {
      const response = await fetch("/retrieve_users_from_selected_date", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date: selectedDate }),
      });

      if (response.ok) {
        console.log("Date submitted successfully:");
        const result = await response.json();
        setSessionLogs(result["conversationLogs"]);
        setSessionNames(result["usernames"]);
      } else {
        console.error("Failed to submit date.");
      }
    } catch (error) {
      console.error("Error submitting date:", error);
    }
  };

  // Get unique language codes from the data
  const languageCodes = Array.from(
    new Set(data.map((item) => item.language_code))
  );

  // Function to handle chat filter
  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  // Function to handle language code filter
  const handleLanguageFilter = (language) => {
    setSelectedLanguage(language);
  };

  // Handle date selection
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value || "-"); // Set to "-" if empty
  };

  // Handle username selection
  const handleUsernameChange = (e) => {
    setSelectedUsername(e.target.value || "-"); // Set to "-" if empty

    if (e.target.value) setShowSelectedUserModal(true);
  };

  console.log("Session logs:", sessionLogs);

  // Filtered info data
  const filteredData = data.filter((info) => {
    const matchesText =
      info.input.toLowerCase().includes(filterText.toLowerCase()) ||
      info.output.toLowerCase().includes(filterText.toLowerCase());

    const matchesLanguage =
      selectedLanguage === "All" || info.language_code === selectedLanguage;

    return matchesText && matchesLanguage;
  });

  // Function to handle when a conversation box is clicked
  const handleConversationClick = (item) => {
    setSelectedItem(item);
    setModalShow(true);
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
  };

  const sortedData = filteredData.sort((a, b) => {
    if (sortOrder === "oldest") {
      return new Date(a.timestamp) - new Date(b.timestamp);
    } else if (sortOrder === "newest") {
      return new Date(b.timestamp) - new Date(a.timestamp);
    }
    return 0;
  });

  return (
    <>
      <span id="conversation-history-title">Conversation Logs</span>
      <i className="bi bi-file-earmark-spreadsheet spreadsheet"></i>
      <span id="conversation-history-description">
        Session Response Logging
      </span>
      <i className="bi bi-body-text numbers"></i>
      <br />
      <div id="content-modification" className="d-flex align-items-center mb-3">
        <input
          id="filter-input"
          type="text"
          placeholder="Search ..."
          value={filterText}
          onChange={handleFilterChange}
          className="mr-3"
        />
        <Dropdown id="dropdown-button" className="mr-3">
          <Dropdown.Toggle variant="primary" id="dropdown-basic-1">
            Language Code: {selectedLanguage}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleLanguageFilter("All")}>
              All Languages
            </Dropdown.Item>
            {languageCodes.map((code) => (
              <Dropdown.Item
                key={code}
                onClick={() => handleLanguageFilter(code)}
              >
                {code}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown id="dropdown-button" className="mr-3">
          <Dropdown.Toggle variant="success" id="dropdown-basic-2">
            Sort by ...
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleSortChange("oldest")}>
              Date (Oldest to Newest)
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleSortChange("newest")}>
              Date (Newest to Oldest)
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <>
          <Button variant="primary" onClick={handleShow} id="session-basic-1">
            Launch Session Response
          </Button>

          <Offcanvas show={show} onHide={handleClose}>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>User Session Logs</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              This tab allows for viewing of user session conversation logs.
              <br />
              <br />
              Toggle the search bar to filter through the logs.
              <br />
              <br />
              <Form.Group controlId="date">
                <Form.Label>
                  <strong>Select Date:</strong>
                </Form.Label>
                <Form.Select value={selectedDate} onChange={handleDateChange}>
                  <option value="">-- Select a date --</option>
                  {sessionDates.map((date, index) => (
                    <option key={index} value={date}>
                      {date}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <br />
              <Button
                variant="info"
                className="session-btn"
                onClick={sendDateToBackend}
              >
                Submit Date
              </Button>
              <Form.Group controlId="username">
                <Form.Label>
                  <strong>Available Users: {sessionNames.length}</strong>
                </Form.Label>
                <Form.Select
                  value={selectedUsername}
                  onChange={handleUsernameChange}
                >
                  <option value="">-- Select a user --</option>
                  {sessionNames.map((username, index) => (
                    <option key={index} value={username}>
                      {username}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Modal show={showSelectedUserModal} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>User Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <p>
                    <strong>Selected Username:</strong> {selectedUsername}
                  </p>
                  <p>You can display more details about the user here.</p>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            </Offcanvas.Body>
          </Offcanvas>
        </>
        <div className="results-count">
          <span className="results-count-title">
            Results found: {filteredData.length}
          </span>
        </div>
      </div>

      <div className="conversation-container">
        {sortedData.map((item) => (
          <div
            key={item.id}
            className="conversation-box"
            onClick={() => handleConversationClick(item)}
          >
            <p>{item.input}</p>
            <p>{item.output}</p>
          </div>
        ))}
      </div>

      <UserInformation
        show={modalShow}
        onHide={() => setModalShow(false)}
        selectedItem={selectedItem}
      />
      <SessionModal
        show={sessionModalShow}
        onHide={handleModalClose}
        selectedDate={selectedDate}
        selectedUsername={selectedUsername}
      />
    </>
  );
}

export default ConversationHistory;
