const express = require('express')
const app = express()
const router = require('./routes')
require('../db/db')

app.use(express.json())

app.use('/', router)

app.listen('3000', () => {console.log('Servidor ativo')})