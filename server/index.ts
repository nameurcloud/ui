import express from 'express';
import path from 'path';
import { GoogleAuth } from 'google-auth-library';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 8080;
const BACKEND_URL = 'https://api.nameurcloud.com';

app.use(express.json());

// Serve static frontend
app.use(express.static(path.join(__dirname, '../dist')));

// Proxy API requests
app.use('/api', async (req, res) => {
  try {
    const auth = new GoogleAuth();
    const client = await auth.getIdTokenClient(BACKEND_URL);
    const headers = await client.getRequestHeaders();

    const backendRes = await fetch(`${BACKEND_URL}${req.originalUrl}`, {
      method: req.method,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : JSON.stringify(req.body),
    });

    const data = await backendRes.text();
    res.status(backendRes.status).send(data);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy failed', details: err });
  }
});

// Serve React for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
