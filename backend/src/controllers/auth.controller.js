import jwt from 'jsonwebtoken'
import {
  createUser,
  findUserByEmail,
  findUserByUsername,
  validatePassword,
  findUserById
} from '../services/user.service.js'

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont requis'
      })
    }

    const existingEmail = await findUserByEmail(email)
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Cet email est déjà utilisé'
      })
    }

    const existingUsername = await findUserByUsername(username)
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: 'Ce nom d\'utilisateur est déjà pris'
      })
    }

    const user = await createUser({ username, email, password })
    const token = generateToken(user.id)

    res.status(201).json({
      success: true,
      message: 'Inscription réussie',
      token,
      user
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription'
    })
  }
}

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Identifiant et mot de passe requis'
      })
    }

    let user = await findUserByEmail(identifier)
    if (!user) {
      user = await findUserByUsername(identifier)
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants invalides'
      })
    }

    if (user.provider === 'GOOGLE') {
      return res.status(401).json({
        success: false,
        message: 'Ce compte utilise Google Login. Veuillez vous connecter avec Google.'
      })
    }

    const isValidPassword = await validatePassword(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants invalides'
      })
    }

    const token = generateToken(user.id)
    const { password: _, ...userWithoutPassword } = user

    res.json({
      success: true,
      message: 'Connexion réussie',
      token,
      user: userWithoutPassword
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion'
    })
  }
}

export const getMe = async (req, res) => {
  try {
    const user = await findUserById(req.user.id)
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      })
    }

    res.json({
      success: true,
      user
    })
  } catch (error) {
    console.error('GetMe error:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil'
    })
  }
}

export const logout = async (req, res) => {
  res.json({
    success: true,
    message: 'Déconnexion réussie'
  })
}

export const googleAuthCallback = async (req, res) => {
  try {
    const user = req.user;

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

     res.redirect(`${process.env.FRONTEND_URL}/login-success?token=${token}`);
  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
  }
};