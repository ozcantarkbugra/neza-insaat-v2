import 'dotenv/config'
import express from 'express'
import compression from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { env } from './config/env'
import prisma from './config/database'
import { errorHandler } from './middleware/errorHandler'
import swaggerUi from 'swagger-ui-express'
import swaggerDefinition from './config/swagger'
import authRoutes from './routes/auth'
import projectRoutes from './routes/projects'
import serviceRoutes from './routes/services'
import blogRoutes from './routes/blogs'
import contactRoutes from './routes/contact'
import adminRoutes from './routes/admin'
import settingsRoutes from './routes/settings'
import path from 'path'

const app = express()

// Proxy (nginx/Docker) arkasında X-Forwarded-For kullanılabilmesi için gerekli
app.set('trust proxy', 1)

app.use(compression())

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
)

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

const uploadsPath = path.join(process.cwd(), 'uploads')
app.use('/uploads', express.static(uploadsPath))

app.use((req, res, next) => {
  if (req.path.startsWith('/uploads')) {
    return next()
  }
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })(req, res, next)
})

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
})
app.use('/api/', limiter)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition))
app.get('/api-docs.json', (_req, res) => res.json(swaggerDefinition))

app.get('/health', async (_req, res) => {
  const timestamp = new Date().toISOString()
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ status: 'ok', db: 'connected', timestamp })
  } catch (err) {
    res.status(503).json({ status: 'degraded', db: 'disconnected', timestamp })
  }
})

app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/blogs', blogRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/settings', settingsRoutes)

app.use(errorHandler)

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

const PORT = env.PORT

app.listen(PORT)
