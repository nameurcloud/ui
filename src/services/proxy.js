import express from 'express';
import { GoogleAuth } from 'google-auth-library';
import { createProxyMiddleware } from 'http-proxy-middleware';
import expressStaticGzip from 'express-static-gzip';
import cors from 'cors';
const app = express();
const auth = new GoogleAuth();

const allowedOrigins = [
  'https://www.nameurcloud.com',
];
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};
// Use the CORS middleware with specified options
app.use(cors(corsOptions)); // Enable CORS for the allowed origin only.


// 🔥 Replace with your actual backend URL
const BACKEND_URL = 'https://api.nameurcloud.com/api';

// Middleware to generate ID token
async function attachIdToken(req, res, next) {
  try {
    console.error("Nirmal get Token")
    const client = await auth.getIdTokenClient(BACKEND_URL);
    const headers = await client.getRequestHeaders();
    console.log(headers)
    req.headers['Authorization'] = headers['Authorization'];
    next();
  } catch (err) {
    console.error('Token generation failed:', err);
    res.status(500).send('Authentication error');
  }
}

// Proxy API requests to backend
app.use('/api', attachIdToken, createProxyMiddleware({
  target: BACKEND_URL,
  changeOrigin: true,
  pathRewrite: { '^/api': '' },
}));

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
