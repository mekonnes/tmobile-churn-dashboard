import React, { useState, useMemo } from 'react';
import './App.css';
import mockData from './mockData';
import { scoreAllCustomers } from './churnScore';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import QueryBox from './components/QueryBox';
import CustomerTable from './components/CustomerTable';

function App() {
  const [region, setRegion] = useState('All');
  const [variable, setVariable] = useState('plan');
  const [activePage, setActivePage] = useState('dashboard');

  const regions = ['All', 'Northwest', 'Midwest', 'Southeast', 'Southwest'];

  const variables = [
    { key: 'plan', label: 'Plan Type' },
    { key: 'lineCount', label: 'Line Count' },
    { key: 'tenureGroup', label: 'Tenure Group' },
    { key: 'deviceAge', label: 'Device Age' },
    { key: 'customerServiceSatisfaction', label: 'Satisfaction Score' },
    { key: 'paymentFailures', label: 'Payment Failures' },
    { key: 'paymentArrangements', label: 'Payment Arrangements' },
    { key: 'contractMonthsLeft', label: 'Contract Months Left' },
    { key: 'dataUsageTrend', label: 'Data Usage Trend' },
  ];

  const scoredData = useMemo(() => scoreAllCustomers(mockData), []);

  const filteredData = region === 'All'
    ? scoredData
    : scoredData.filter(c => c.region === region);

  return (
    <div className="app">
      <Header activePage={activePage} setActivePage={setActivePage} />
      <main className="main-content">

        <div className="page-title">
          <h2>
            {activePage === 'dashboard' && 'Churn Risk Overview'}
            {activePage === 'retention' && 'Customer Action List'}
            {activePage === 'insights' && 'AI Insights'}
          </h2>
          <p>Analyzing {filteredData.length} customers — select a region to filter</p>
        </div>

        <div className="region-filter">
          {regions.map(r => (
            <button
              key={r}
              className={`filter-btn ${region === r ? 'active' : ''}`}
              onClick={() => setRegion(r)}
            >
              {r}
            </button>
          ))}
        </div>

        {activePage === 'dashboard' && (
          <>
            <div className="variable-selector">
              <p className="variable-label">Analyze by:</p>
              <div className="variable-buttons">
                {variables.map(v => (
                  <button
                    key={v.key}
                    className={`variable-btn ${variable === v.key ? 'active' : ''}`}
                    onClick={() => setVariable(v.key)}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
            <Dashboard data={filteredData} region={region} variable={variable} />
          </>
        )}

        {activePage === 'retention' && (
          <CustomerTable data={filteredData} />
        )}

        {activePage === 'insights' && (
          <QueryBox data={filteredData} />
        )}

      </main>
    </div>
  );
}

export default App;