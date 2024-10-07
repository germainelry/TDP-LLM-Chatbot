import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import "./ConvoResolution.css";

// Submodal to display user message and bot response
function SubModal({ show, onHide, userMessage, botResponse }) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      centered
      className="modal-content"
    >
      <Modal.Header closeButton>
        <Modal.Title>Conversation Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <strong>User Message:</strong> {userMessage}
        </p>
        <p>
          <strong>Bot Response:</strong> {botResponse}
        </p>
      </Modal.Body>
    </Modal>
  );
}

const resolutionDescriptions = {
  Resolved:
    "These conversations have been successfully resolved by human intervention.",
  Unresolved:
    "These conversations are still pending resolution. AI unable to satisfy user queries and users were not able to get the desired response.",
  Escalated:
    "These conversations have been escalated to higher support. AI unable to satisfy user queries, and requested for human interaction.",
};

function ResolutionModal(props) {
  const [subModalShow, setSubModalShow] = useState(false);
  const [selectedConvo, setSelectedConvo] = useState({});

  const handleResolve = (index) => {
    props.onResolve(index);
  };

  const openSubModal = (convo) => {
    setSelectedConvo(convo);
    setSubModalShow(true);
  };

  return (
    <>
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="resolution-modal-pop-up"
        className="resolution-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {props.title} Conversations
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{resolutionDescriptions[props.title]}</p>
          {props.conversations && props.conversations.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>
                    User Name
                    <i className="bi bi-person icon-header" />
                  </th>
                  <th>
                    Contact Number
                    <i className="bi bi-phone icon-header" />
                  </th>
                  <th>
                    User Feedback
                    <i className="bi bi-chat-dots icon-header" />
                  </th>
                  {(props.title === "Unresolved" ||
                    props.title === "Escalated") && (
                    <th>
                      Action
                      <i className="bi bi-tools icon-header" />
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {props.conversations.map((convo, index) => (
                  <tr key={index}>
                    <td>{convo[0]}</td>
                    <td>{convo[1]}</td>
                    <td>{convo[4]}</td>
                    {(props.title === "Unresolved" ||
                      props.title === "Escalated") && (
                      <td>
                        <Button
                          variant="info"
                          onClick={() => openSubModal(convo)}
                        >
                          View Details
                        </Button>{" "}
                        <Button
                          variant="success"
                          onClick={() => handleResolve(index)}
                        >
                          Resolve
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No conversations available.</p>
          )}
        </Modal.Body>
      </Modal>

      {/* Submodal for showing user message and bot response */}
      <SubModal
        show={subModalShow}
        onHide={() => setSubModalShow(false)}
        userMessage={selectedConvo[2]}
        botResponse={selectedConvo[3]}
        size="xl"
        centered
        dialogClassName="sub-modal-pop-up"
      />
    </>
  );
}

export default ResolutionModal;
