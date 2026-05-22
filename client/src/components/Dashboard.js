import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

function getGroups(variable, data) {
  switch (variable) {
    case 'region':
      return ['Northwest', 'Midwest', 'Southeast', 'Southwest'];
    case 'plan':
      return ['Essentials', 'Experience More', 'Experience Beyond'];
    case 'lineCount':
      return ['1 Line', '2 Lines', '3 Lines', '4+ Lines'];
    case 'tenureGroup':
      return ['0-6 mo', '7-12 mo', '13-24 mo', '25-48 mo', '49+ mo'];
    case 'deviceAge':
      return ['1 yr', '2 yrs', '3 yrs', '4 yrs', '5+ yrs'];
    case 'customerServiceSatisfaction':
      return ['Score 1', 'Score 2', 'Score 3', 'Score 4', 'Score 5'];
    case 'paymentFailures':
      return ['0 Failures', '1-2 Failures', '3-4 Failures', '5+ Failures'];
    case 'paymentArrangements':
      return ['0 Arrangements', '1-2 Arrangements', '3-4 Arrangements', '5+ Arrangements'];
    case 'contractMonthsLeft':
      return ['0 mo', '1-6 mo', '7-12 mo', '13-18 mo', '19-24 mo'];
    case 'dataUsageTrend':
      return ['Declining Fast', 'Declining', 'Stable', 'Growing', 'Growing Fast'];
    default:
      return [];
  }
}

function filterByGroup(variable, group, data) {
  switch (variable) {
    case 'region':
      return data.filter(c => c.region === group);
    case 'plan':
      return data.filter(c => c.plan === group);
    case 'lineCount':
      if (group === '1 Line') return data.filter(c => c.lineCount === 1);
      if (group === '2 Lines') return data.filter(c => c.lineCount === 2);
      if (group === '3 Lines') return data.filter(c => c.lineCount === 3);
      return data.filter(c => c.lineCount >= 4);
    case 'tenureGroup':
      if (group === '0-6 mo') return data.filter(c => c.tenure <= 6);
      if (group === '7-12 mo') return data.filter(c => c.tenure > 6 && c.tenure <= 12);
      if (group === '13-24 mo') return data.filter(c => c.tenure > 12 && c.tenure <= 24);
      if (group === '25-48 mo') return data.filter(c => c.tenure > 24 && c.tenure <= 48);
      return data.filter(c => c.tenure > 48);
    case 'deviceAge':
      if (group === '1 yr') return data.filter(c => c.deviceAge === 1);
      if (group === '2 yrs') return data.filter(c => c.deviceAge === 2);
      if (group === '3 yrs') return data.filter(c => c.deviceAge === 3);
      if (group === '4 yrs') return data.filter(c => c.deviceAge === 4);
      return data.filter(c => c.deviceAge >= 5);
    case 'customerServiceSatisfaction':
      return data.filter(c => c.customerServiceSatisfaction === parseInt(group.split(' ')[1]));
    case 'paymentFailures':
      if (group === '0 Failures') return data.filter(c => c.paymentFailures === 0);
      if (group === '1-2 Failures') return data.filter(c => c.paymentFailures >= 1 && c.paymentFailures <= 2);
      if (group === '3-4 Failures') return data.filter(c => c.paymentFailures >= 3 && c.paymentFailures <= 4);
      return data.filter(c => c.paymentFailures >= 5);
    case 'paymentArrangements':
      if (group === '0 Arrangements') return data.filter(c => c.paymentArrangements === 0);
      if (group === '1-2 Arrangements') return data.filter(c => c.paymentArrangements >= 1 && c.paymentArrangements <= 2);
      if (group === '3-4 Arrangements') return data.filter(c => c.paymentArrangements >= 3 && c.paymentArrangements <= 4);
      return data.filter(c => c.paymentArrangements >= 5);
    case 'contractMonthsLeft':
      if (group === '0 mo') return data.filter(c => c.contractMonthsLeft === 0);
      if (group === '1-6 mo') return data.filter(c => c.contractMonthsLeft >= 1 && c.contractMonthsLeft <= 6);
      if (group === '7-12 mo') return data.filter(c => c.contractMonthsLeft >= 7 && c.contractMonthsLeft <= 12);
      if (group === '13-18 mo') return data.filter(c => c.contractMonthsLeft >= 13 && c.contractMonthsLeft <= 18);
      return data.filter(c => c.contractMonthsLeft >= 19);
    case 'dataUsageTrend':
      if (group === 'Declining Fast') return data.filter(c => c.dataUsageTrend <= -3);
      if (group === 'Declining') return data.filter(c => c.dataUsageTrend > -3 && c.dataUsageTrend <= -0.5);
      if (group === 'Stable') return data.filter(c => c.dataUsageTrend > -0.5 && c.dataUsageTrend <= 0.5);
      if (group === 'Growing') return data.filter(c => c.dataUsageTrend > 0.5 && c.dataUsageTrend <= 3);
      return data.filter(c => c.dataUsageTrend > 3);
    default:
      return [];
  }
}

function Dashboard({ data, region, variable }) {
  const high = data.filter(c => c.riskLevel === 'High');
  const medium = data.filter(c => c.riskLevel === 'Medium');
  const low = data.filter(c => c.riskLevel === 'Low');
  const avgScore = data.length
    ? Math.round(data.reduce((sum, c) => sum + c.churnScore, 0) / data.length)
    : 0;

  const groups = getGroups(variable, data);

  const groupData = groups.map(g => filterByGroup(variable, g, data));

  const avgScores = groupData.map(g =>
    g.length ? Math.round(g.reduce((s, c) => s + c.churnScore, 0) / g.length) : 0
  );

  const highCounts = groupData.map(g => g.filter(c => c.riskLevel === 'High').length);
  const mediumCounts = groupData.map(g => g.filter(c => c.riskLevel === 'Medium').length);
  const lowCounts = groupData.map(g => g.filter(c => c.riskLevel === 'Low').length);

  const riskDistributionData = {
    labels: ['High Risk', 'Medium Risk', 'Low Risk'],
    datasets: [{
      data: [high.length, medium.length, low.length],
      backgroundColor: ['#E20074', '#FF8C00', '#00A550'],
      borderWidth: 0,
      hoverOffset: 8,
    }]
  };

  const avgScoreByGroupData = {
    labels: groups,
    datasets: [{
      label: 'Avg Churn Score',
      data: avgScores,
      backgroundColor: avgScores.map(s =>
        s >= 60 ? '#E20074' : s >= 35 ? '#FF8C00' : '#00A550'
      ),
      borderRadius: 8,
      borderWidth: 0,
    }]
  };

  const riskBreakdownData = {
    labels: groups,
    datasets: [
      {
        label: 'High Risk',
        data: highCounts,
        backgroundColor: '#E20074',
        borderRadius: 4,
        borderWidth: 0,
      },
      {
        label: 'Medium Risk',
        data: mediumCounts,
        backgroundColor: '#FF8C00',
        borderRadius: 4,
        borderWidth: 0,
      },
      {
        label: 'Low Risk',
        data: lowCounts,
        backgroundColor: '#00A550',
        borderRadius: 4,
        borderWidth: 0,
      },
    ]
  };

  const tenureGroups = ['0-6 mo', '7-12 mo', '13-24 mo', '25-48 mo', '49+ mo'];
  const tenureScores = [
    data.filter(c => c.tenure <= 6),
    data.filter(c => c.tenure > 6 && c.tenure <= 12),
    data.filter(c => c.tenure > 12 && c.tenure <= 24),
    data.filter(c => c.tenure > 24 && c.tenure <= 48),
    data.filter(c => c.tenure > 48),
  ].map(group =>
    group.length
      ? Math.round(group.reduce((sum, c) => sum + c.churnScore, 0) / group.length)
      : 0
  );

  const tenureData = {
    labels: tenureGroups,
    datasets: [{
      label: 'Avg Churn Score',
      data: tenureScores,
      borderColor: '#E20074',
      backgroundColor: 'rgba(226,0,116,0.08)',
      borderWidth: 2,
      pointBackgroundColor: '#E20074',
      pointRadius: 5,
      fill: true,
      tension: 0.4,
    }]
  };

const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#F4F4F4' },
        ticks: { color: '#999', font: { size: 11 } },
        title: {
          display: true,
          text: 'Avg Churn Score',
          color: '#999',
          font: { size: 11, weight: '600' },
        }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#999', font: { size: 11 } },
      }
    }
  };

  const stackedOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: { font: { size: 12 }, color: '#1A1A1A', padding: 16 }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        stacked: true,
        grid: { color: '#F4F4F4' },
        ticks: { color: '#999', font: { size: 11 } },
      },
      x: {
        stacked: true,
        grid: { display: false },
        ticks: { color: '#999', font: { size: 11 } },
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: { size: 13 },
          color: '#1A1A1A',
        }
      }
    },
    cutout: '70%',
  };

  const variableLabels = {
    region: 'Region',
    plan: 'Plan Type',
    lineCount: 'Line Count',
    tenureGroup: 'Tenure Group',
    deviceAge: 'Device Age',
    customerServiceSatisfaction: 'Satisfaction Score',
    paymentFailures: 'Payment Failures',
    paymentArrangements: 'Payment Arrangements',
    contractMonthsLeft: 'Contract Months Left',
    dataUsageTrend: 'Data Usage Trend',
  };

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
          <Doughnut data={riskDistributionData} options={doughnutOptions} />
        </div>
        <div className="chart-card">
          <h3>Avg Churn Score by {variableLabels[variable]}</h3>
          <Bar data={avgScoreByGroupData} options={chartOptions} />
        </div>
        <div className="chart-card">
          <h3>Risk Breakdown by {variableLabels[variable]}</h3>
          <Bar data={riskBreakdownData} options={stackedOptions} />
        </div>
        <div className="chart-card">
          <h3>Churn Score by Customer Tenure</h3>
          <Line data={tenureData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;