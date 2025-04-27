import express from 'express';
import { GoogleAuth } from 'google-auth-library';
import { createProxyMiddleware } from 'http-proxy-middleware';
import expressStaticGzip from 'express-static-gzip';

const app = express();
const auth = new GoogleAuth();

// 🔥 Replace with your actual backend URL
const BACKEND_URL = 'https://api.nameurcloud.com';

// Middleware to generate ID token
async function attachIdToken(req, res, next) {
  try {
    const client = await auth.getIdTokenClient(BACKEND_URL);
    const headers = await client.getRequestHeaders();
    req.headers['Authorization'] = headers['Authorization'];
    next();
  } catch (err) {
    console.error('Token generation failed:', err);
    res.status(500).send('Authentication error');
  }
}

// Proxy API requests to backend
//app.use('/api', attachIdToken, createProxyMiddleware({
//  target: BACKEND_URL,
//  changeOrigin: true,
//  pathRewrite: { '^/api': '' },
//}));

// Serve frontend static files
app.use('/', expressStaticGzip('dist', {
  enableBrotli: true,
  orderPreference: ['br', 'gzip'],
  setHeaders: (res, path) => {
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  },
}));

// Health check endpoint (optional for Cloud Run)
app.get('/healthz', (req, res) => res.status(200).send('ok'));

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
