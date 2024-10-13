import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import UserFrequencyChart from "./UserFrequencyChart";
import LanguagesDistribution from "./LanguagesDistribution";
import ConvoResolution from "./ConvoResolution";
import WordCloudDisplay from "./WordCloudDisplay";
import ChatDuration from "./ChatDuration";
import TopicTagging from "./TopicTagging";

function Dashboard() {
  const [data, setData] = useState({
    unique_users: 0,
    total_conversations: 0,
    languages_detected: 0,
    average_response_time: 0,
  });

  const [pctData, setPctData] = useState({
    percentage_change_interactions: 0.0,
    percentage_change_users: 0.0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/percentage__metric_computation");
        const data = await response.json();
        setPctData(data);
      } catch (error) {
        console.error("Error fetching basic chat information:", error);
      }
    };

    fetchData();
  }, []);

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

  const showAlert = () => {
    alert(
      "This score reflects the average sentiment derived from user feedback, ranging from 0 (negative) to  0.5 (neutral) to 1 (positive)."
    );
  };

  return (
    <>
      <div id="metrics-top" className="row align-items-center">
        <div className="row">
          <div id="metric-container" className="col-md-3 col-sm-6 col-xs-12">
            <div className="mini-stat clearfix bg-metrics">
              <div className="mini-stat-info">
                <span id="userCount">{data.unique_users}</span>
                Total Number of Users
                <i className="bi bi-person-fill ms-2"></i>
              </div>
              <div className="mini-stat-percentage percentage-change">
                <span
                  style={{
                    color:
                      pctData.percentage_change_users >= 0 ? "green" : "red",
                  }}
                >
                  {pctData.percentage_change_users >= 0 ? "+" : "-"}
                  {pctData.percentage_change_users.toFixed(1)}%
                </span>
                <span className="mini-stat-percentage-label span-text">
                  <i>since last week</i>
                </span>
              </div>
            </div>
          </div>
          <div id="metric-container" className="col-md-3 col-sm-6 col-xs-12">
            <div className="mini-stat clearfix bg-metrics">
              <div className="mini-stat-info">
                <span id="interactionCount">{data.total_conversations}</span>
                Total Interactions Logged
                <i className="bi bi-chat-dots-fill ms-2"></i>
              </div>
              <div className="mini-stat-percentage percentage-change">
                <span
                  style={{
                    color:
                      pctData.percentage_change_interactions >= 0
                        ? "green"
                        : "red",
                  }}
                >
                  {pctData.percentage_change_interactions >= 0 ? "+" : "-"}
                  {pctData.percentage_change_interactions.toFixed(1)}%
                </span>
                <span className="mini-stat-percentage-label span-text">
                  <i>since last week</i>
                </span>
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
          <div id="metric-container" className="col-md-3 col-sm-6 col-xs-12">
            <div className="mini-stat clearfix bg-metrics">
              <div className="mini-stat-info">
                <span
                  className="sentiment-score"
                  id="sentimentScore"
                  onClick={showAlert}
                >
                  {0.35523}
                </span>
                Feedback Sentiment Score (0-1)
                <i className="bi bi-award-fill ms-2"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="charts-container-1a">
        <div className="chart-item chart-large">
          <UserFrequencyChart />
        </div>
        <div className="chart-item chart-small">
          <LanguagesDistribution />
        </div>
        <div className="chart-item chart-small">
          <TopicTagging />
        </div>
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
