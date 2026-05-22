import React, { useState } from 'react';
import './App.css';
import mockData from './mockData';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import QueryBox from './components/QueryBox';

function App() {
  const [region, setRegion] = useState('All');

  const regions = ['All', 'Northwest', 'Midwest', 'Southeast', 'Southwest'];

  const filteredData = region === 'All'
    ? mockData
    : mockData.filter(c => c.region === region);

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="page-title">
          <h2>Churn Risk Overview</h2>
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
        <Dashboard data={filteredData} />
        <QueryBox data={filteredData} />
      </main>
    </div>
  );
}

export default App;