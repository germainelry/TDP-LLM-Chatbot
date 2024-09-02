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
              <li key={index}>{convo}</li>
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
  const [data, setData] = useState({
    Resolved: 10,
    Unresolved: 5,
    Escalated: 3,
  });

  const [modalShow, setModalShow] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState("");
  const [conversations, setConversations] = useState([]);

  const dummyData = {
    Resolved: [
      "Resolved Convo 1",
      "Resolved Convo 2",
      "Resolved Convo 3",
      "Resolved Convo 4",
      "Resolved Convo 5",
      "Resolved Convo 6",
      "Resolved Convo 7",
      "Resolved Convo 8",
      "Resolved Convo 9",
      "Resolved Convo 10",
      "Resolved Convo 11",
      "Resolved Convo 12",
      "Resolved Convo 13",
      "Resolved Convo 14",
      "Resolved Convo 15",
      "Resolved Convo 16",
      "Resolved Convo 17",
      "Resolved Convo 18",
      "Resolved Convo 19",
      "Resolved Convo 20",
      "Resolved Convo 21",
      "Resolved Convo 22",
      "Resolved Convo 23",
      "Resolved Convo 24",
      "Resolved Convo 25",
      "Resolved Convo 26",
      "Resolved Convo 27",
      "Resolved Convo 28",
      "Resolved Convo 29",
      "Resolved Convo 30",
    ],
    Unresolved: ["Unresolved Convo 1", "Unresolved Convo 2"],
    Escalated: ["Escalated Convo 1", "Escalated Convo 2", "Escalated Convo 3"],
  };

  const handleCardClick = (metric) => {
    setSelectedMetric(metric);
    setConversations(dummyData[metric]);
    setModalShow(true);
  };

  useEffect(() => {
    // Fetch actual data from API
    fetch("/conversation_resolution_metrics")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  }, []);

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
                        {data.Resolved}
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
                        {data.Unresolved}
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
                        {data.Escalated}
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
