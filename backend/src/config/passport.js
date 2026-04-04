import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import dotenv from 'dotenv'
import prisma from '../prisma/client.js'

dotenv.config()

export const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await prisma.user.findUnique({
            where: { email: profile.emails[0].value }
          })

          if (!user) {
             user = await prisma.user.create({
              data: {
                email: profile.emails[0].value,
                username: profile.displayName.replace(/\s/g, '').toLowerCase(),
                image: profile.photos[0]?.value,
                provider: 'GOOGLE',
                role: 'USER'
              }
            })
          }

          return done(null, user)
        } catch (error) {
          return done(error, null)
        }
      }
    )
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { id } })
      done(null, user)
    } catch (error) {
      done(error, null)
    }
  })
}

export default configurePassport