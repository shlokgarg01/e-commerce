const app = require('./app')
const cloudinary = require('cloudinary')
const connectDatabase = require("./config/database")
require('dotenv').config()

// Handling Uncaught Exception
process.on("uncaughtException", err => {
  console.log(`Shutting down the server due to uncaughtException`)

  process.exit(1)
})

if(process.env.NODE_ENV !== 'PRODUCTION') {
  require('dotenv').config({ path: "e_commerce_backend/.env" })
}

connectDatabase()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const server = app.listen(process.env.PORT, ()=>{
  console.log(`Server is running on PORT ${process.env.PORT}`)
})

// Unhandled Promise Rejection
process.on("unhandledRejection", err => {
  console.log('Error - ', err.message)
  console.log(`Shutting down the server due to unhandledRejection`)

  server.close(() => {
    process.exit(1)
  })
})