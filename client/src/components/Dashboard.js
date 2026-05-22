import React from 'react';

function Dashboard({ data }) {
  return (
    <div className="dashboard">
      <div className="stats-row">
        <div className="stat-card">
          <h3>Total Customers</h3>
          <p className="stat-number">{data.length}</p>
        </div>
        <div className="stat-card high">
          <h3>High Risk</h3>
          <p className="stat-number">
            {data.filter(c => c.serviceCalls > 5 || c.paymentFailures > 2).length}
          </p>
        </div>
        <div className="stat-card medium">
          <h3>Medium Risk</h3>
          <p className="stat-number">
            {data.filter(c => (c.serviceCalls >= 3 && c.serviceCalls <= 5) || (c.paymentFailures >= 1 && c.paymentFailures <= 2)).length}
          </p>
        </div>
        <div className="stat-card low">
          <h3>Low Risk</h3>
          <p className="stat-number">
            {data.filter(c => c.serviceCalls < 3 && c.paymentFailures === 0).length}
          </p>
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