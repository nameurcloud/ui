import express from 'express';
import { GoogleAuth } from 'google-auth-library';
import { createProxyMiddleware } from 'http-proxy-middleware';
import expressStaticGzip from 'express-static-gzip';
import cors from 'cors';
const app = express();
const auth = new GoogleAuth();

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
// Use the CORS middleware with specified options
app.use(cors(corsOptions)); // Enable CORS for the allowed origin only.


// 🔥 Replace with your actual backend URL
const BACKEND_URL = 'https://api.nameurcloud.com';

// Middleware to generate ID token
async function attachIdToken(req, res, next) {
  try {
    console.error("Generating ID token for request:", req.method, req.originalUrl);

    const client = await auth.getIdTokenClient(BACKEND_URL);
    const headers = await client.getRequestHeaders();
    
    console.error("Generated Authorization header:", headers['Authorization']);

    req.headers['Authorization'] = headers['Authorization'];
    console.log(req.headers)
    console.log(req.next)
    console.log("going to proxy")
    next();
  } catch (err) {
    console.error('Token generation failed:', err);
    res.status(500).send('Authentication error');
  }
}

// Proxy API requests to backend
app.use('/api', (req, res, next) => {
  console.log('Request received:', req.method, req.originalUrl);  // Log when the request is received
  next();  // Pass control to the next middleware
}, attachIdToken, (req, res, next) => {
  console.log('Inside attachIdToken middleware');  // Log to see if we're inside this middleware
  next();  // Pass control to the next middleware (proxy)
}, createProxyMiddleware({
  target: 'https://api.nameurcloud.com/api',
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    console.log('Forwarding request to backend:', req.originalUrl);  // Log the URL being forwarded
  },
  onError: (err, req, res) => {
    console.log('Proxy error:', err);  // Logs if the proxy request fails
    res.status(500).send('Proxy error');
  }
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
