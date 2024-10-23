import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Dropdown from "react-bootstrap/Dropdown";
import { Offcanvas, Form } from "react-bootstrap";
import moment from "moment";
import "./ConversationHistory.css";
import "daterangepicker/daterangepicker.css";
import $ from "jquery";
import "daterangepicker";

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

function SelectedUserConversation({
  show,
  onHide,
  selectedUsername,
  selectedUserLog,
}) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      centered
      className="session-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>User: {selectedUsername}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedUserLog.length > 0 ? (
          selectedUserLog.map((log, index) => (
            <div key={index} className="chat-log">
              <div className="user-log p-3 mb-2 rounded bg-light session-input">
                <p className="mb-0">
                  <i class="bi bi-person-fill"></i>
                  <strong>Input:</strong> <br />
                  {log.input}
                </p>
              </div>
              <br />
              <br />
              <br />
              <div className="bot-log p-3 mb-2 rounded bg-primary session-output">
                <p className="mb-0 text-white">
                  <i class="bi bi-reply-all-fill"></i>
                  <strong>Output:</strong> <br />
                  {log.output.split("\n").map((line, index) => (
                    <p
                      key={index}
                      style={{ margin: 0 }}
                      className="text-white mb-0"
                    >
                      {line}
                    </p>
                  ))}
                </p>
              </div>
              <div style={{ clear: "both" }}></div>
              <hr />
            </div>
          ))
        ) : (
          <p>No conversation logs available for this user.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
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
  const [selectedItem, setSelectedItem] = useState(null);
  const [sortOrder, setSortOrder] = useState("oldest");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedUsername, setSelectedUsername] = useState("");

  // Selected User Modal
  const [showSelectedUserModal, setShowSelectedUserModal] = useState(false);
  const [selectedUserConversationLog, setSelectedUserConversationLog] =
    useState([]);

  // Daterange for conversation history
  const [dateRange, setDateRange] = useState({
    startDate: moment().subtract(29, "days"),
    endDate: moment(),
  });

  // Initialize date range picker
  useEffect(() => {
    const cb = (start, end) => {
      setDateRange({ startDate: start, endDate: end });
      $("#reportrange span").html(
        `${start.format("MMMM D, YYYY")} - ${end.format("MMMM D, YYYY")}`
      );
    };

    $("#reportrange").daterangepicker(
      {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        ranges: {
          Today: [moment(), moment()],
          Yesterday: [
            moment().subtract(1, "days"),
            moment().subtract(1, "days"),
          ],
          "Last 7 Days": [moment().subtract(6, "days"), moment()],
          "Last 30 Days": [moment().subtract(29, "days"), moment()],
          "This Month": [moment().startOf("month"), moment().endOf("month")],
          "Last Month": [
            moment().subtract(1, "month").startOf("month"),
            moment().subtract(1, "month").endOf("month"),
          ],
        },
      },
      cb
    );

    cb(dateRange.startDate, dateRange.endDate);
  }, [dateRange.startDate, dateRange.endDate]);

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
    const key = e.target.value + selectedDate;

    if (e.target.value) {
      const userLogs = sessionLogs[key];
      setSelectedUserConversationLog(userLogs);
      setShowSelectedUserModal(true);
    }
  };

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

  const showAlertWithSelectedDate = () => {
    alert(
      `Selected Date Range: ${dateRange.startDate.format(
        "DD/MM/YY"
      )} - ${dateRange.endDate.format("DD/MM/YY")}`
    );
  };

  return (
    <>
      <span id="conversation-history-title">Conversation Logs</span>
      <i className="bi bi-file-earmark-spreadsheet spreadsheet"></i>
      <span id="conversation-history-description">Session Logs</span>
      <i className="bi bi-body-text numbers"></i>
      <span id="conversation-history-dates">Date Range Picker</span>
      <i class="bi bi-calendar-date calendar"></i>
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
            View User Session
          </Button>

          <div
            id="reportrange"
            style={{
              background: "#fff",
              cursor: "pointer",
              padding: "5px 10px",
              border: "1px solid #ccc",
              width: "40%",
            }}
          >
            <i className="fa fa-calendar"></i>&nbsp;
            <span>{`${dateRange.startDate.format(
              "DD/MM/YY"
            )} - ${dateRange.endDate.format("DD/MM/YY")}`}</span>{" "}
            <i className="fa fa-caret-down"></i>
          </div>

          <button
            onClick={showAlertWithSelectedDate}
            className="btn btn-primary"
            id="session-basic-1"
          >
            Show Selected Date
          </button>

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
            <h5>
              <b>{item.input}</b>
            </h5>
            <p>{item.output}</p>
          </div>
        ))}
      </div>

      <UserInformation
        show={modalShow}
        onHide={() => setModalShow(false)}
        selectedItem={selectedItem}
      />
      <SelectedUserConversation
        show={showSelectedUserModal}
        onHide={() => setShowSelectedUserModal(false)}
        selectedUsername={selectedUsername}
        selectedUserLog={selectedUserConversationLog}
      />
    </>
  );
}

export default ConversationHistory;
