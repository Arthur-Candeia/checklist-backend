const express = require('express')
const app = express()
const cors = require('cors')
const methodOverride = require('method-override')
const router = require('./routes')
require('../db/db')

app.use((request, response, next) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
  app.use(cors());
  next();
});
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method', {methods: ['POST', 'GET']}))


app.use('/', router)

const port = process.env.PORT ?? 8080
app.listen(port, () => {console.log('Servidor ativo')})