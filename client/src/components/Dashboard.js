import React from 'react';

function Dashboard({ data }) {
  const high = data.filter(c => c.riskLevel === 'High');
  const medium = data.filter(c => c.riskLevel === 'Medium');
  const low = data.filter(c => c.riskLevel === 'Low');
  const avgScore = data.length
    ? Math.round(data.reduce((sum, c) => sum + c.churnScore, 0) / data.length)
    : 0;

  return (
    <div className="dashboard">
      <div className="stats-row">
        <div className="stat-card">
          <h3>Total Customers</h3>
          <p className="stat-number">{data.length}</p>
          <p className="stat-label">across all risk levels</p>
        </div>
        <div className="stat-card high">
          <h3>High Risk</h3>
          <p className="stat-number">{high.length}</p>
          <p className="stat-label">score 60 or above</p>
        </div>
        <div className="stat-card medium">
          <h3>Medium Risk</h3>
          <p className="stat-number">{medium.length}</p>
          <p className="stat-label">score 35 to 59</p>
        </div>
        <div className="stat-card low">
          <h3>Low Risk</h3>
          <p className="stat-number">{low.length}</p>
          <p className="stat-label">score below 35</p>
        </div>
      </div>

      <div className="avg-score-bar">
        <div className="avg-score-label">
          <span>Average Churn Risk Score</span>
          <span className="avg-score-number">{avgScore}/100</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${avgScore}%`,
              background: avgScore >= 60 ? '#E20074' : avgScore >= 35 ? '#FF8C00' : '#00A550'
            }}
          />
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Risk Distribution</h3>
          <div className="chart-placeholder">Chart coming Day 5</div>
        </div>
        <div className="chart-card">
          <h3>Risk by Plan Type</h3>
          <div className="chart-placeholder">Chart coming Day 5</div>
        </div>
        <div className="chart-card">
          <h3>Churn Risk by Tenure</h3>
          <div className="chart-placeholder">Chart coming Day 5</div>
        </div>
        <div className="chart-card">
          <h3>Top Risk Factors</h3>
          <div className="chart-placeholder">Chart coming Day 5</div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;