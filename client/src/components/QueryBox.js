import React, { useState } from 'react';

function QueryBox({ data }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  return (
    <div className="query-box">
      <h2>Ask About Your Customers</h2>
      <p>Type a question in plain English and get instant insights</p>
      <div className="query-input-row">
        <input
          type="text"
          placeholder="e.g. How many customers are high risk?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="query-input"
        />
        <button className="query-btn">Ask</button>
      </div>
      {answer && (
        <div className="query-answer">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

export default QueryBox;