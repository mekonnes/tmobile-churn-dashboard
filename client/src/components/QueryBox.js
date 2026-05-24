import React, { useState } from 'react';

function QueryBox({ data }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const suggestions = [
    "How many customers are high risk?",
    "Which plan has the most churn risk?",
    "What is the top risk factor across all customers?",
    "How many customers have payment failures?",
    "Which region has the highest average churn score?",
    "How many customers have no contract remaining?",
  ];

  async function askQuestion(q) {
    const questionToAsk = q || question;
    if (!questionToAsk.trim()) return;

    setLoading(true);
    setAnswer('');

    const high = data.filter(c => c.riskLevel === 'High').length;
    const medium = data.filter(c => c.riskLevel === 'Medium').length;
    const low = data.filter(c => c.riskLevel === 'Low').length;
    const avgScore = Math.round(data.reduce((s, c) => s + c.churnScore, 0) / data.length);
    const topPlan = ['Essentials', 'Experience More', 'Experience Beyond']
      .map(p => ({
        plan: p,
        avg: Math.round(data.filter(c => c.plan === p).reduce((s, c) => s + c.churnScore, 0) / (data.filter(c => c.plan === p).length || 1))
      }))
      .sort((a, b) => b.avg - a.avg)[0].plan;

    const dataContext = `
You are an AI analyst for T-Mobile's customer retention team. Answer questions about this dataset:

Dataset Summary:
- Total customers: ${data.length}
- High risk: ${high} (score 60+)
- Medium risk: ${medium} (score 35-59)
- Low risk: ${low} (score below 35)
- Average churn score: ${avgScore}/100
- Highest risk plan: ${topPlan}
- Customers with payment failures: ${data.filter(c => c.paymentFailures > 0).length}
- Customers with payment arrangements: ${data.filter(c => c.paymentArrangements > 0).length}
- Customers with no contract remaining: ${data.filter(c => c.contractMonthsLeft === 0).length}
- Customers with recent line cancellation: ${data.filter(c => c.recentLineCancellation).length}
- Customers with low satisfaction (1-2): ${data.filter(c => c.customerServiceSatisfaction <= 2).length}
- Northwest avg score: ${Math.round(data.filter(c => c.region === 'Northwest').reduce((s, c) => s + c.churnScore, 0) / (data.filter(c => c.region === 'Northwest').length || 1))}
- Midwest avg score: ${Math.round(data.filter(c => c.region === 'Midwest').reduce((s, c) => s + c.churnScore, 0) / (data.filter(c => c.region === 'Midwest').length || 1))}
- Southeast avg score: ${Math.round(data.filter(c => c.region === 'Southeast').reduce((s, c) => s + c.churnScore, 0) / (data.filter(c => c.region === 'Southeast').length || 1))}
- Southwest avg score: ${Math.round(data.filter(c => c.region === 'Southwest').reduce((s, c) => s + c.churnScore, 0) / (data.filter(c => c.region === 'Southwest').length || 1))}

Answer the following question clearly and concisely in 2-3 sentences. Use specific numbers from the data above.
Question: ${questionToAsk}`;

    try {
      const response = await fetch('https://tmobile-churn-dashboard.onrender.com/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: dataContext })
      });

      const result = await response.json();
      const ans = result.answer;

      setAnswer(ans);
      setHistory(prev => [{ question: questionToAsk, answer: ans }, ...prev].slice(0, 5));
      setQuestion('');
    } catch (err) {
      setAnswer('Unable to get a response. Please check your API key and try again.');
    }
    setLoading(false);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') askQuestion();
  }

  return (
    <div className="insights-page">
      <div className="insights-intro">
        <h3>Ask anything about your customers</h3>
        <p>Type a question in plain English and get instant data-driven answers powered by AI.</p>
      </div>

      <div className="suggestions-row">
        {suggestions.map((s, i) => (
          <button
            key={i}
            className="suggestion-chip"
            onClick={() => askQuestion(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="query-input-row">
        <input
          type="text"
          placeholder="e.g. Which region has the most urgent customers?"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          className="query-input"
          disabled={loading}
        />
        <button
          className="query-btn"
          onClick={() => askQuestion()}
          disabled={loading}
        >
          {loading ? 'Thinking...' : 'Ask'}
        </button>
      </div>

      {loading && (
        <div className="insights-loading">
          <div className="loading-dots">
            <span></span><span></span><span></span>
          </div>
          <p>Analyzing your customer data...</p>
        </div>
      )}

      {answer && !loading && (
        <div className="insights-answer">
          <div className="answer-label">AI Response</div>
          <p>{answer}</p>
        </div>
      )}

      {history.length > 0 && (
        <div className="insights-history">
          <h4>Previous Questions</h4>
          {history.map((item, i) => (
            <div key={i} className="history-item">
              <div className="history-question">Q: {item.question}</div>
              <div className="history-answer">{item.answer}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default QueryBox;