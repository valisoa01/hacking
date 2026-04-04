import express from 'express'
import cors from 'cors'
import passport from 'passport'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes.js'
import adminRoutes from './routes/admin.routes.js'
import configurePassport from './config/passport.js'

dotenv.config()

const app = express()

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

configurePassport()
app.use(passport.initialize())

app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)

app.get('/', (req, res) => {
  res.json({
    message: 'API Auth System',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      google: 'GET /api/auth/google',
      me: 'GET /api/auth/me',
      admin: 'GET /api/admin/dashboard'
    }
  })
})

 app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: 'Quelque chose s\'est mal passé!'
  })
})

export default app