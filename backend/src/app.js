const express = require('express')
const app = express()
const cors = require('cors')
const router = require('./routes')
require('../db/db')
const allowedOrigins = ['https://checklist-fullstack-arthur-candeia.vercel.app']

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