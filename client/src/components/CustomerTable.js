import React, { useState } from 'react';

function getTopRiskFactors(customer) {
  const factors = [
    { label: 'High service calls', value: customer.serviceCalls >= 7 ? customer.serviceCalls * 3 : 0 },
    { label: 'Payment failures', value: customer.paymentFailures >= 3 ? customer.paymentFailures * 10 : 0 },
    { label: 'Payment arrangements', value: customer.paymentArrangements >= 3 ? customer.paymentArrangements * 9 : 0 },
    { label: 'Low satisfaction', value: customer.customerServiceSatisfaction <= 2 ? (3 - customer.customerServiceSatisfaction) * 8 : 0 },
    { label: 'No contract', value: customer.contractMonthsLeft === 0 ? 15 : 0 },
    { label: 'Line cancellation', value: customer.recentLineCancellation ? 12 : 0 },
    { label: 'Declining data usage', value: customer.dataUsageTrend <= -3 ? Math.abs(customer.dataUsageTrend) * 2 : 0 },
    { label: 'Old device', value: customer.deviceAge >= 5 ? customer.deviceAge * 2 : 0 },
    { label: 'Short tenure', value: customer.tenure <= 6 ? (7 - customer.tenure) * 2 : 0 },
  ];
  return factors
    .filter(f => f.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 2)
    .map(f => f.label);
}
function CustomerCard({ customer, onGetRec, recommendation, loading }) {
  return (
    <div className={`customer-card ${customer.riskLevel.toLowerCase()}`}>
      <div className="card-top">
        <div className="card-account">{customer.accountNumber}</div>
        <div className="card-score-block">
  <div className={`card-score ${customer.riskLevel.toLowerCase()}`}>
    {customer.churnScore}
  </div>
  <div className={`card-score-label ${customer.riskLevel.toLowerCase()}`}>
    {customer.churnScore >= 80 ? 'URGENT' : customer.churnScore >= 60 ? 'HIGH' : 'MONITOR'}
  </div>
</div>
      </div>
      <div className="card-info">
        <span className="card-region">{customer.region}</span>
        <span className="card-dot">·</span>
        <span className="card-plan">{customer.plan}</span>
      </div>
      <div className="card-bill">${customer.monthlyBill}/mo · {customer.lineCount} line{customer.lineCount > 1 ? 's' : ''}</div>
      <div className="card-risk-factor">
        <span className="risk-factor-label">Top risks:</span> {getTopRiskFactors(customer).join(' · ')}
      </div>
      <div className="card-signals">
        {customer.serviceCalls > 5 && (
          <span className="signal">📞 {customer.serviceCalls} calls</span>
        )}
        {customer.paymentFailures > 2 && (
          <span className="signal">💳 {customer.paymentFailures} failures</span>
        )}
        {customer.recentLineCancellation && (
          <span className="signal">📉 Line cancelled</span>
        )}
        {customer.contractMonthsLeft === 0 && (
          <span className="signal">⏰ No contract</span>
        )}
        {customer.customerServiceSatisfaction <= 2 && (
          <span className="signal">😞 Low satisfaction</span>
        )}
      </div>
      <button
        className="card-rec-btn"
        onClick={() => onGetRec(customer)}
        disabled={loading}
      >
        {loading ? 'Analyzing...' : recommendation ? '✓ View Recommendation' : '✨ Get AI Recommendation'}
      </button>
      {recommendation && (
        <div className="card-recommendation">
          {recommendation}
        </div>
      )}
    </div>
  );
}

function CustomerTable({ data }) {
  const [riskFilter, setRiskFilter] = useState('High');
  const [recommendations, setRecommendations] = useState({});
  const [loadingRec, setLoadingRec] = useState(null);

  const urgent = data.filter(c => c.churnScore >= 80).sort((a, b) => b.churnScore - a.churnScore);
  const high = data.filter(c => c.churnScore >= 60 && c.churnScore < 80).sort((a, b) => b.churnScore - a.churnScore);
  const medium = data.filter(c => c.churnScore >= 35 && c.churnScore < 60).sort((a, b) => b.churnScore - a.churnScore);

  const filtered = riskFilter === 'Urgent' ? urgent
    : riskFilter === 'High' ? high
    : riskFilter === 'Medium' ? medium
    : [...urgent, ...high, ...medium];

  async function getRecommendation(customer) {
    if (recommendations[customer.accountNumber]) return;
    setLoadingRec(customer.accountNumber);

    const prompt = `You are a T-Mobile retention specialist. Give one specific retention action in one sentence (max 20 words):
- Plan: ${customer.plan}
- Churn Score: ${customer.churnScore}/100
- Top Risk: ${getTopRiskFactors(customer).join(', ')}
- Service Calls: ${customer.serviceCalls}
- Payment Failures: ${customer.paymentFailures}
- Satisfaction: ${customer.customerServiceSatisfaction}/5
- Contract Left: ${customer.contractMonthsLeft} months
Respond with only the recommendation.`;

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 60,
          temperature: 0.3,
        })
      });

      const result = await response.json();
      const rec = result.choices[0].message.content.trim();
      setRecommendations(prev => ({ ...prev, [customer.accountNumber]: rec }));
    } catch (err) {
      setRecommendations(prev => ({ ...prev, [customer.accountNumber]: 'Unable to generate recommendation.' }));
    }
    setLoadingRec(null);
  }

  return (
    <div className="retention-page">
      <div className="retention-summary">
        <div className="retention-stat urgent">
          <span className="ret-number">{urgent.length}</span>
          <span className="ret-label">Urgent (80+)</span>
        </div>
        <div className="retention-stat high">
          <span className="ret-number">{high.length}</span>
          <span className="ret-label">High Risk (60-79)</span>
        </div>
        <div className="retention-stat medium">
          <span className="ret-number">{medium.length}</span>
          <span className="ret-label">Monitor (35-59)</span>
        </div>
        <div className="retention-stat total">
          <span className="ret-number">{urgent.length + high.length + medium.length}</span>
          <span className="ret-label">Total At Risk</span>
        </div>
      </div>

      <div className="retention-filter-bar">
        {['All', 'Urgent', 'High', 'Medium'].map(f => (
          <button
            key={f}
            className={`ret-filter-btn ${riskFilter === f ? `active-${f.toLowerCase()}` : ''}`}
            onClick={() => setRiskFilter(f)}
          >
            {f === 'Urgent' ? `🔴 Urgent (${urgent.length})`
              : f === 'High' ? `🟠 High (${high.length})`
              : f === 'Medium' ? `🟡 Monitor (${medium.length})`
              : `All (${urgent.length + high.length + medium.length})`}
          </button>
        ))}
      </div>

      <div className="cards-grid">
        {filtered.map(customer => (
          <CustomerCard
            key={customer.accountNumber}
            customer={customer}
            onGetRec={getRecommendation}
            recommendation={recommendations[customer.accountNumber]}
            loading={loadingRec === customer.accountNumber}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="no-customers">
          No customers in this category for the selected region.
        </div>
      )}
    </div>
  );
}

export default CustomerTable;