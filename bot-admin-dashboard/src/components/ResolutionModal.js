import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import "./ConvoResolution.css";

const resolutionDescriptions = {
  Resolved:
    "These conversations have been successfully resolved by human intervention.",
  Unresolved:
    "These conversations are still pending resolution. AI unable to satisfy user queries and users were not able to get the desired response.",
  Escalated:
    "These conversations have been escalated to higher support. AI unable to satisfy user queries, and requested for human interaction.",
};

function ResolutionModal(props) {
  const handleResolve = (index) => {
    // Handle marking the conversation as resolved, e.g., updating backend
    props.onResolve(index);
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
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
                <th>User ID</th>
                <th>User Message</th>
                {(props.title === "Unresolved" ||
                  props.title === "Escalated") && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {props.conversations.map((convo, index) => (
                <tr key={index}>
                  <td>{convo[0]}</td>
                  <td>{convo[1]}</td>
                  {(props.title === "Unresolved" ||
                    props.title === "Escalated") && (
                    <td>
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
  );
}

export default ResolutionModal;
