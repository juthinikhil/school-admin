const express = require('express');
const http = require('http');
const app = express();
const PORT = process.env.PORT || 5002;
const OLLAMA_HOST = process.env.OLLAMA_HOST || '172.17.0.1';
const OLLAMA_PORT = process.env.OLLAMA_PORT || '11434';
const MODEL = process.env.AI_MODEL || 'qwen2.5-coder:7b';

app.use(express.json());

const PROMPT_MAP = {
  Principal: 'You are an institutional administrator copilot. Provide strategic, data-driven school operational plans.',
  Teacher: 'You are a pedagogical teaching copilot. Help design quizzes, structured rubrics, and constructive lesson plans.',
  Parent: 'You are a supportive school liaison for parents. Translate academic jargon into clear, supportive guidance.',
  Student: 'You are a strict Socratic study tutor. Guide the student with hints and reasoning steps, never giving direct homework answers.'
};

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'ai-service', model: MODEL }));

app.post('/generate', (req, res) => {
  const { role, prompt } = req.body;
  const systemPrompt = PROMPT_MAP[role] || PROMPT_MAP.Student;

  const postData = JSON.stringify({
    model: MODEL,
    prompt: prompt,
    system: systemPrompt,
    stream: false,
    options: { temperature: 0.3, num_predict: 512 }
  });

  const request = http.request({
    hostname: OLLAMA_HOST,
    port: OLLAMA_PORT,
    path: '/api/generate',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  }, (response) => {
    let data = '';
    response.on('data', chunk => data += chunk);
    response.on('end', () => {
      try {
        const json = JSON.parse(data);
        res.json({ reply: json.response || 'No response generated.' });
      } catch (e) {
        res.status(500).json({ error: 'Failed parsing model response', raw: data });
      }
    });
  });

  request.on('error', (err) => {
    res.status(502).json({ error: 'Cannot connect to Ollama', details: err.message });
  });

  request.write(postData);
  request.end();
});

app.listen(PORT, '0.0.0.0', () => console.log(`AI Gateway on 0.0.0.0:${PORT}`));
