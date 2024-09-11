import React, { useEffect, useState } from "react";
import "./ConversationHistory.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Dropdown from "react-bootstrap/Dropdown";

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

function ConversationHistory() {
  const [data, setData] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [sortOrder, setSortOrder] = useState("oldest");

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

  // Function to handle chat filter
  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };
  // Filtered info data
  const filteredData = data.filter(
    (info) =>
      info.input.toLowerCase().includes(filterText.toLowerCase()) ||
      info.output.toLowerCase().includes(filterText.toLowerCase())
  );
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
    return 0; // Default case
  });
  return (
    <>
      <span id="conversation-history-title">Conversation History</span>
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
          <Dropdown.Toggle variant="success" id="dropdown-basic">
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
        <div className="results-count">
          <span className="results-count-title">
            Results found: {filteredData.length}
          </span>
        </div>
      </div>
      <UserInformation
        show={modalShow}
        onHide={() => setModalShow(false)}
        selectedItem={selectedItem}
      />
      <div className="conversation-container">
        <div>
          {sortedData.length > 0 ? (
            sortedData.map((item, index) => (
              <div
                key={index}
                className="conversation-box"
                onClick={() => handleConversationClick(item)}
                style={{ cursor: "pointer", marginBottom: "10px" }}
              >
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{item.input}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                      {item.timestamp}
                    </h6>
                    <p className="card-text">{item.output}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No matching information found.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default ConversationHistory;
