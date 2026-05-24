const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

async function callGroq(messages, maxTokens = 150) {
  const fetch = (await import('node-fetch')).default;
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      max_tokens: maxTokens,
      temperature: 0.3,
    })
  });
  const data = await response.json();
  return data.choices[0].message.content.trim();
}

// AI Insights query endpoint
app.post('/api/query', async (req, res) => {
  try {
    const { prompt } = req.body;
    const answer = await callGroq([{ role: 'user', content: prompt }], 150);
    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get response' });
  }
});

// Retention recommendation endpoint
app.post('/api/recommend', async (req, res) => {
  try {
    const { prompt } = req.body;
    const recommendation = await callGroq([{ role: 'user', content: prompt }], 60);
    res.json({ recommendation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get recommendation' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));