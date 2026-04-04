import prisma from '../prisma/client.js'
import bcrypt from 'bcrypt'

export const createUser = async (userData) => {
  const { username, email, password, provider = 'LOCAL' } = userData
  
  const hashedPassword = password ? await bcrypt.hash(password, 10) : null
  
  return prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      provider,
      role: 'USER'
    },
    select: {
      id: true,
      username: true,
      email: true,
      image: true,
      role: true,
      provider: true,
      createdAt: true
    }
  })
}

export const findUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email }
  })
}

export const findUserByUsername = async (username) => {
  return prisma.user.findUnique({
    where: { username }
  })
}

export const findUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      email: true,
      image: true,
      role: true,
      provider: true,
      createdAt: true
    }
  })
}

export const validatePassword = async (inputPassword, hashedPassword) => {
  return bcrypt.compare(inputPassword, hashedPassword)
}