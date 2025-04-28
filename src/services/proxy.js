import express from 'express';
import { GoogleAuth } from 'google-auth-library';
import { createProxyMiddleware } from 'http-proxy-middleware';
import expressStaticGzip from 'express-static-gzip';
import cors from 'cors';

const app = express();
const auth = new GoogleAuth();

// CORS Setup
const allowedOrigins = [
  'https://www.nameurcloud.com',
  'http://www.nameurcloud.com',
  'https://nameurcloud.com',
  'http://nameurcloud.com'
];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

// 🔥 Backend base URL
const BACKEND_URL = 'https://api.nameurcloud.com';

// Middleware to attach ID token
async function attachIdToken(req, res, next) {
  try {
    console.log("Generating ID token for:", req.method, req.originalUrl);

    const client = await auth.getIdTokenClient(BACKEND_URL);
    const headers = await client.getRequestHeaders();

    console.log("Authorization header set:", headers['Authorization']);

    req.headers['Authorization'] = 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjIzZjdhMzU4Mzc5NmY5NzEyOWU1NDE4ZjliMjEzNmZjYzBhOTY0NjIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiNjE4MTA0NzA4MDU0LTlyOXMxYzRhbGczNmVybGl1Y2hvOXQ1Mm4zMm42ZGdxLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiNjE4MTA0NzA4MDU0LTlyOXMxYzRhbGczNmVybGl1Y2hvOXQ1Mm4zMm42ZGdxLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTEyNTA1NDEzMjc2Nzk5OTU1MDY5IiwiZW1haWwiOiJuaXJtYWxtYW5nYWxhdC5sZWFybmluZ0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6InM4R2VBZkhPU1lFMnU0RmFaY0o0a1EiLCJuYmYiOjE3NDU4NjI3MTUsImlhdCI6MTc0NTg2MzAxNSwiZXhwIjoxNzQ1ODY2NjE1LCJqdGkiOiJkZjU1YTA5ZDY5NDJiNjk3MWQzNDkyMzdjMjViNDZhODJkNjk3MTgzIn0.QNS1C7NOTCW6wfXbofZBo_KoRQK63PDuWyRmCdbkvbD2XA4yQ_3UcIoFDkLn_G8zeN7Il3roBvRBEotAGC3sREWuE1hb9eNOpEz-SShpfAdTm3KoLeMjAsrLBYmWKRqGXtL2LF08aieIOjvV1WBeWpO-FB-LSG5DlAKaY5eK2Xq3TsDK-SXlDY4nFPUP6WoaAha_qEu1s6bAolGdyLbc_gRSrudZzHeOgZ8UqhFfTaZJ1-Pt45rlC5h1Z9OkX_R5U7t-JxBx1eBUR3VJUHj00rWoOBUrqJDey74Ii3o4kJyWI5auKmZVjdRLNOFC-2my2ZPs1dJqcjaAm9YPLMoJ2Q';
    console.log("Authorization header set:", req.headers['Authorization'] );
    next();
  } catch (err) {
    console.error('Failed to attach ID token:', err);
    res.status(500).send('Authentication error');
  }
}

// Proxy API requests
app.use('/api', attachIdToken, createProxyMiddleware({
  target: BACKEND_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api', // Keep '/api' in the path when forwarding
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log('Forwarding to backend:', req.method, req.url);
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).send('Proxy error');
  }
}));

// Serve frontend
app.use('/', expressStaticGzip('dist', {
  enableBrotli: true,
  orderPreference: ['br', 'gzip'],
  setHeaders: (res, path) => {
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  },
}));

// Health check
app.get('/healthz', (req, res) => res.status(200).send('ok'));

// Start
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
