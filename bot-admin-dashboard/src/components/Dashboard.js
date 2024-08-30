import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import UserFrequencyChart from "./UserFrequencyChart";
import LanguagesDistribution from "./LanguagesDistribution";

function Dashboard() {
  const [data, setData] = useState({
    unique_users: 0,
    total_conversations: 0,
    languages_detected: [],
  });
  useEffect(() => {
    fetch("/basic_chat_information")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  }, []);
  return (
    <>
      <div className="row align-items-center ">
        <div className="row">
          <div className="col-md-3 col-sm-6 col-xs-12">
            <div className="mini-stat clearfix bg-usersCount">
              <div className="mini-stat-info">
                <span id="userCount">{data.unique_users}</span>
                Number of Users
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 col-xs-12">
            <div className="mini-stat clearfix bg-conversations">
              <div className="mini-stat-info">
                <span id="interactionCount">{data.total_conversations}</span>
                Number of Interactions Logged
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 col-xs-12">
            <div className="mini-stat clearfix bg-languages">
              <div className="mini-stat-info">
                <span id="languageCount">{data.languages_detected}</span>
                Languages Detected
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="charts-container">
        <UserFrequencyChart />
        <LanguagesDistribution />
      </div>
    </>
  );
}

export default Dashboard;
