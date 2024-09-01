import React, { useEffect, useState } from "react";
import "./ConvoResolution.css";

function ConvoResolution() {
  const [data, setData] = useState({
    Resolved: 0,
    Unresolved: 0,
    Escalated: 0,
  });
  useEffect(() => {
    fetch("/conversation_resolution_metrics")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  }, []);
  return (
    <>
      <div>
        <span id="resolution-title">Resolution Metrics</span>
        <div className="row">
          <div className="row gy-4">
            <div id="metric-card" className="col-sm-4">
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
            <div id="metric-card" className="col-sm-4">
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
            <div id="metric-card" className="col-sm-4">
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
