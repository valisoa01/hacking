import express from 'express'
import { authenticateToken } from '../middlewares/auth.middleware.js'
import { isAdmin } from '../middlewares/role.middleware.js'

const router = express.Router()

router.get('/dashboard', authenticateToken, isAdmin, (req, res) => {
  res.json({
    success: true,
    message: 'Bienvenue dans le panel admin',
    user: req.user
  })
})

export default router