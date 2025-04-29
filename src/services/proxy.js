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

    req.headers['Authorization'] = headers['Authorization'];
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

app.get('*', (req, res, next) => {
  if (req.method === 'GET' && !req.originalUrl.startsWith('/api')) {
    res.sendFile('index.html', { root: 'dist' });
  } else {
    next();
  }
});

// Health check
app.get('/healthz', (req, res) => res.status(200).send('ok'));

// Start
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
