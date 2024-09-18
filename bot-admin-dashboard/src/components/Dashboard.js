import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import UserFrequencyChart from "./UserFrequencyChart";
import LanguagesDistribution from "./LanguagesDistribution";
import ConvoResolution from "./ConvoResolution";
import WordCloudDisplay from "./WordCloudDisplay";
import ChatDuration from "./ChatDuration";

function Dashboard() {
  const [data, setData] = useState({
    unique_users: 0,
    total_conversations: 0,
    languages_detected: 0,
    average_response_time: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/basic_chat_information");
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Error fetching basic chat information:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div id="metrics-top" className="row align-items-center">
        <div className="row">
          <div id="metric-container" className="col-md-3 col-sm-6 col-xs-12">
            <div className="mini-stat clearfix bg-metrics">
              <div className="mini-stat-info">
                <span id="userCount">{data.unique_users}</span>
                Number of Users
                <i className="bi bi-person-fill ms-2"></i>
              </div>
            </div>
          </div>
          <div id="metric-container" className="col-md-3 col-sm-6 col-xs-12">
            <div className="mini-stat clearfix bg-metrics">
              <div className="mini-stat-info">
                <span id="interactionCount">{data.total_conversations}</span>
                Number of Interactions Logged
                <i className="bi bi-chat-dots-fill ms-2"></i>
              </div>
            </div>
          </div>
          <div id="metric-container" className="col-md-3 col-sm-6 col-xs-12">
            <div className="mini-stat clearfix bg-metrics">
              <div className="mini-stat-info">
                <span id="languageCount">{data.languages_detected}</span>
                Languages Detected
                <i className="bi bi-translate ms-2"></i>
              </div>
            </div>
          </div>
          <div id="metric-container" className="col-md-3 col-sm-6 col-xs-12">
            <div className="mini-stat clearfix bg-metrics">
              <div className="mini-stat-info">
                <span id="languageCount">{data.average_response_time}</span>
                Average Response Time (seconds)
                <i className="bi bi-clock-fill ms-2"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="charts-container-1">
        <UserFrequencyChart />
        <LanguagesDistribution />
      </div>
      <div className="charts-container-1">
        <div className="charts-container-second-1">
          <div className="charts-container-2">
            <ConvoResolution />
          </div>
          <div className="charts-container-3">
            <WordCloudDisplay />
          </div>
        </div>
        <div className="charts-container-second-2">
          <ChatDuration />
        </div>
      </div>
    </>
  );
}

export default Dashboard;
