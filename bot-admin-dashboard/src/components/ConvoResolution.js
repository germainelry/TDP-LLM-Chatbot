import React, { useEffect, useState } from "react";
import "./ConvoResolution.css";
import ResolutionModal from "./ResolutionModal"; // Assuming ResolutionModal is in the same folder

function ConvoResolution() {
  const [data, setData] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState("");
  const [conversations, setConversations] = useState([]);

  const handleCardClick = (metric) => {
    setSelectedMetric(metric);
    setConversations(resolutionData[metric]);
    setModalShow(true);
  };

  const handleResolve = async (index) => {
    const resolvedConversation = conversations[index];
    console.log("Resolving conversation:", resolvedConversation);

    if (selectedMetric === "Unresolved" || selectedMetric === "Escalated") {
      const updatedConversations = conversations.filter((_, i) => i !== index);
      setConversations(updatedConversations);

      try {
        const response = await fetch("/update_conversation_status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_name: resolvedConversation[0],
            contact_no: resolvedConversation[1],
            user_input: resolvedConversation[2],
            bot_response: resolvedConversation[3],
            user_feedback: resolvedConversation[4],
            status: selectedMetric,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update conversation status.");
        }

        console.log("Conversation status updated successfully.");
      } catch (error) {
        console.error("Error updating conversation status:", error);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/conversation_resolution_metrics");
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Error fetching conversation resolution metrics:", error);
      }
    };

    fetchData();
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

  const resolutionData = {
    Resolved: resolvedArray.map((item) => [
      item.user_name,
      item.contact_no,
      item.user_input,
      item.bot_response,
      item.user_feedback,
    ]),
    Unresolved: unresolvedArray.map((item) => [
      item.user_name,
      item.contact_no,
      item.user_input,
      item.bot_response,
      item.user_feedback,
    ]),
    Escalated: escalatedArray.map((item) => [
      item.user_name,
      item.contact_no,
      item.user_input,
      item.bot_response,
      item.user_feedback,
    ]),
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
        onResolve={handleResolve} // Pass the resolve handler to the modal
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
