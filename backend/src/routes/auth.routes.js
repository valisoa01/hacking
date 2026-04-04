import express from 'express'
import passport from 'passport'
import {
  register,
  login,
  getMe,
  logout,
  googleAuthCallback
} from '../controllers/auth.controller.js'
import { authenticateToken } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', authenticateToken, getMe)
router.post('/logout', authenticateToken, logout)

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: false 
  }),
  googleAuthCallback
)

export default router