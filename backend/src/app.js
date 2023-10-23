const express = require('express')
const app = express()
const cors = require('cors')
const router = require('./routes')
const rateLimit = require('express-rate-limit')
const allowedOrigins = ['https://checklist-fullstack-arthur-candeia.vercel.app']
const limiter = rateLimit({windowMs: 30 * 60 * 1000, max: 100, message: {err: 'Too many requests!', msg: 'Too many requests!'}})
require('../db/db')

app.use(limiter)
app.use(express.json())
app.use(cors({
  origin: function(origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true)
    }
    else {
      callback(new Error(origin + ' não é habilitado pelo CORS'))
    }
  },
  credentials: true,
  methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}))

app.use('/', router)
const PORT = process.env.PORT ?? 8080
app.listen(PORT, () => {console.log(`Server is running on PORT ${PORT}`)})