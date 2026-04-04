import app from './app.js'
import testConnection from './config/db.js'

const PORT = process.env.PORT || 5000

const startServer = async () => {
  await testConnection()
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`)
  })
}

startServer()