import 'dotenv/config'
import express from 'express'
import compression from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { env } from './config/env'
import { errorHandler } from './middleware/errorHandler'
import authRoutes from './routes/auth'
import projectRoutes from './routes/projects'
import serviceRoutes from './routes/services'
import blogRoutes from './routes/blogs'
import contactRoutes from './routes/contact'
import adminRoutes from './routes/admin'
import settingsRoutes from './routes/settings'
import path from 'path'

const app = express()

// Compression (gzip)
app.use(compression())

// CORS
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
)

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Serve uploaded files FIRST (before helmet to avoid 403)
const uploadsPath = path.join(process.cwd(), 'uploads')
app.use('/uploads', express.static(uploadsPath))

// Security middleware (after static files, but skip for /uploads)
app.use((req, res, next) => {
  if (req.path.startsWith('/uploads')) {
    return next()
  }
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })(req, res, next)
})

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})
app.use('/api/', limiter)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/blogs', blogRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/settings', settingsRoutes)

// Error handling
app.use(errorHandler)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

const PORT = env.PORT

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📊 Environment: ${env.NODE_ENV}`)
})
