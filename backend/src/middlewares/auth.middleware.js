import jwt from 'jsonwebtoken'
import prisma from '../prisma/client.js'

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Accès non autorisé. Token manquant.' 
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        image: true
      }
    })

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Utilisateur non trouvé.' 
      })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(403).json({ 
      success: false, 
      message: 'Token invalide ou expiré.' 
    })
  }
}