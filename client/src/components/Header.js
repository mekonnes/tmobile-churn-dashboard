import React, { useState } from 'react';

function Header() {
  const [tooltip, setTooltip] = useState('');

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <span className="logo-icon">M</span>
          <span className="logo-text">agenta Intelligence</span>
        </div>
        <div className="header-nav">
          <div
            className="nav-item"
            onMouseEnter={() => setTooltip('dashboard')}
            onMouseLeave={() => setTooltip('')}
          >
            Dashboard
            {tooltip === 'dashboard' && (
              <div className="tooltip">View churn risk overview and key metrics</div>
            )}
          </div>
          <div
            className="nav-item"
            onMouseEnter={() => setTooltip('insights')}
            onMouseLeave={() => setTooltip('')}
          >
            AI Insights
            {tooltip === 'insights' && (
              <div className="tooltip">Ask questions about your customer data</div>
            )}
          </div>
          <div
            className="nav-item"
            onMouseEnter={() => setTooltip('retention')}
            onMouseLeave={() => setTooltip('')}
          >
            Retention
            {tooltip === 'retention' && (
              <div className="tooltip">View AI-generated retention recommendations</div>
            )}
          </div>
        </div>
        <div className="header-badge">Internal Tool</div>
      </div>
    </header>
  );
}

export default Header;