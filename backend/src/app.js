const express = require('express')
const app = express()
const router = require('./routes')
require('../db/db')

app.use(express.json())

app.use('/', router)

const port = process.env.PORT ?? 8080
app.listen(port, () => {console.log('Servidor ativo')})