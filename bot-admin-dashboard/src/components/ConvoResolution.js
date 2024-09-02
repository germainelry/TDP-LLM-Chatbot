import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
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
          <ul>
            {props.conversations.map((convo, index) => (
              <li key={index}>
                <span key={index}>
                  <b>User ID: </b>
                  {convo[0]} ---- <b>User Message: </b>
                  {convo[1]}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No conversations available.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

function ConvoResolution() {
  const [data, setData] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState("");
  const [conversations, setConversations] = useState([]);

  const handleCardClick = (metric) => {
    setSelectedMetric(metric);
    setConversations(dummyData[metric]);
    setModalShow(true);
  };

  useEffect(() => {
    fetch("/conversation_resolution_metrics")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  }, []);

  const unresolvedSet = new Set();
  const resolvedSet = new Set();
  const escalatedSet = new Set();

  data.forEach((category) => {
    for (const [status, chats] of Object.entries(category)) {
      chats.forEach((chat) => {
        if (status === "Unresolved") {
          unresolvedSet.add(JSON.stringify(chat));
        } else if (status === "Resolved") {
          resolvedSet.add(JSON.stringify(chat));
        } else if (status === "Escalated") {
          escalatedSet.add(JSON.stringify(chat));
        }
      });
    }
  });

  const unresolvedArray = Array.from(unresolvedSet).map(JSON.parse);
  const resolvedArray = Array.from(resolvedSet).map(JSON.parse);
  const escalatedArray = Array.from(escalatedSet).map(JSON.parse);

  const dummyData = {
    Resolved: resolvedArray.map((item) => [item.user_id, item.conversation]),
    Unresolved: unresolvedArray.map((item) => [
      item.user_id,
      item.conversation,
    ]),
    Escalated: escalatedArray.map((item) => [item.user_id, item.conversation]),
  };

  const statusCounts = {
    Unresolved: unresolvedArray.length,
    Resolved: resolvedArray.length,
    Escalated: escalatedArray.length,
  };

  return (
    <>
      <ResolutionModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        title={selectedMetric}
        conversations={conversations}
      />
      <div>
        <span id="resolution-title">Resolution Metrics</span>
        <div className="row">
          <div className="row gy-4">
            <div
              id="metric-card"
              className="col-sm-4"
              onClick={() => handleCardClick("Resolved")}
            >
              <div className="card widget-card border-light shadow-sm">
                <div className="card-body p-3">
                  <div className="row">
                    <div className="col-8">
                      <h5
                        id="resolved-metric"
                        className="card-title widget-card-title mb-3"
                      >
                        Resolved
                      </h5>
                      <h4 className="card-subtitle text-body-secondary m-0">
                        {statusCounts.Resolved}
                      </h4>
                    </div>
                    <div className="col-4">
                      <i className="bi bi-check-circle green-icon fs-1"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              id="metric-card"
              className="col-sm-4"
              onClick={() => handleCardClick("Unresolved")}
            >
              <div className="card widget-card border-light shadow-sm">
                <div className="card-body p-3">
                  <div className="row">
                    <div className="col-8">
                      <h5
                        id="unresolved-metric"
                        className="card-title widget-card-title mb-3"
                      >
                        Unresolved
                      </h5>
                      <h4 className="card-subtitle text-body-secondary m-0">
                        {statusCounts.Unresolved}
                      </h4>
                    </div>
                    <div className="col-4">
                      <i className="bi bi-exclamation-triangle red-icon fs-1"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              id="metric-card"
              className="col-sm-4"
              onClick={() => handleCardClick("Escalated")}
            >
              <div className="card widget-card border-light shadow-sm">
                <div className="card-body p-3">
                  <div className="row">
                    <div className="col-8">
                      <h5
                        id="escalated-metric"
                        className="card-title widget-card-title mb-3"
                      >
                        Escalated
                      </h5>
                      <h4 className="card-subtitle text-body-secondary m-0">
                        {statusCounts.Escalated}
                      </h4>
                    </div>
                    <div className="col-4">
                      <i className="bi bi-headset fs-1"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ConvoResolution;
