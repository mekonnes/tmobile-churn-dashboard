import React, { useState } from 'react';

function Header({ activePage, setActivePage }) {
  const [tooltip, setTooltip] = useState('');

  const navItems = [
    { key: 'dashboard', label: 'Dashboard', tip: 'View churn risk overview and key metrics' },
    { key: 'insights', label: 'AI Insights', tip: 'Ask questions about your customer data' },
    { key: 'retention', label: 'Retention', tip: 'View and act on high risk customers' },
  ];

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <span className="logo-icon">M</span>
          <span className="logo-text">agenta Intelligence</span>
        </div>
        <div className="header-nav">
          {navItems.map(item => (
            <div
              key={item.key}
              className={`nav-item ${activePage === item.key ? 'nav-active' : ''}`}
              onClick={() => setActivePage(item.key)}
              onMouseEnter={() => setTooltip(item.key)}
              onMouseLeave={() => setTooltip('')}
            >
              {item.label}
              {tooltip === item.key && (
                <div className="tooltip">{item.tip}</div>
              )}
            </div>
          ))}
        </div>
        <div className="header-badge">Internal Tool</div>
      </div>
    </header>
  );
}

export default Header;