import express from 'express'
import { GoogleAuth } from 'google-auth-library'
import { createProxyMiddleware } from 'http-proxy-middleware'
import expressStaticGzip from 'express-static-gzip'
import cors from 'cors'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const mode = process.env.NODE_ENV || 'development'
dotenv.config({ path: `.env.${mode}` })
const app = express()
const auth = new GoogleAuth()

// CORS Setup
const allowedOrigins = [
  'https://www.nameurcloud.com',
  'http://www.nameurcloud.com',
  'https://nameurcloud.com',
  'http://nameurcloud.com',
  'http://localhost:5173',
]
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}
app.use(cors(corsOptions))

// 🔥 Backend base URL

const BACKEND_URL = process.env.BACKEND_URL

if (!BACKEND_URL) {
  console.error('❌ BACKEND_URL is not defined. Check your environment files.')
  process.exit(1)
} else {
  console.log('🚀 BACKEND_URL used in proxy:', BACKEND_URL)
  console.log('__dirname:', __dirname)
  console.log('Current working directory:', process.cwd())
}

// Middleware to attach ID token
async function attachIdToken(req, res, next) {
  if (process.env.SKIP_AUTH === 'true') {
    console.log('⚠️ Skipping ID token (local dev mode)')
    return next()
  }
  console.log('⚠️ With ID token (Production mode)')
  try {
    console.log('Generating ID token for:', req.method, req.originalUrl)

    const client = await auth.getIdTokenClient(BACKEND_URL)
    const headers = await client.getRequestHeaders()
    req.headers['Authorization'] = headers['Authorization']
    next()
  } catch (err) {
    console.error('Failed to attach ID token:', err)
    res.status(500).send('Authentication error')
  }
}

// Proxy API requests
app.use(
  '/api',
  attachIdToken,
  createProxyMiddleware({
    target: BACKEND_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/api': '', // Keep '/api' in the path when forwarding
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log('Forwarding to backend:', req.method, req.url)
    },
    onError: (err, req, res) => {
      console.error('Proxy error:', err)
      res.status(500).send('Proxy error')
    },
  })
)

// Serve frontend
app.use(
  '/',
  expressStaticGzip('dist', {
    enableBrotli: true,
    orderPreference: ['br', 'gzip'],
    setHeaders: (res, path) => {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    },
  })
)

// Health check
app.get('/healthz', (req, res) => res.status(200).send('ok'))

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`)
  next()
})

//all
app.use((req, res) => {
  const filePath = path.resolve(__dirname, 'dist', 'index.html')
  console.log('Serving file from:', filePath) // Log the absolute path to index.html
  res.sendFile(filePath)
})

// Start
const PORT = process.env.SERVER_PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
