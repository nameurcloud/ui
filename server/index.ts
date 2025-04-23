import express from 'express';
import { GoogleAuth } from 'google-auth-library';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 8080;

// Replace with your backend URL
const BACKEND_URL = 'https://api.nameurcloud.com';

app.use(express.json());

app.use('/api', async (req, res) => {
  try {
    // Step 1: Get Identity Token
    const auth = new GoogleAuth();
    const client = await auth.getIdTokenClient(BACKEND_URL);
    const headers = await client.getRequestHeaders();

    // Step 2: Proxy request to backend
    const backendRes = await fetch(`${BACKEND_URL}${req.originalUrl}`, {
      method: req.method,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });

    const data = await backendRes.text();
    res.status(backendRes.status).send(data);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy failed', details: err });
  }
});

app.listen(PORT, () => {
  console.log(`Frontend proxy server running on http://localhost:${PORT}`);
});
