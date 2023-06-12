const express = require('express')
const router = express.Router()
const User = require('../db/model')

router.get('/', async (request, response) => {
  //let user = new User({name: 'nome', password: '1234', tasks: {content: 'conteúdo'}})
  //await user.save()
  let passar = await User.find()
  response.status(200).send(`<h3>${passar}</h3>`)
})

router.get('/add', async (request, response) => {
  //let user = await User.findById('648689b0316798868667d033')
  //await user.tasks.push({content: 'TERCEIRO CONTEÚDO'})
  //await user.save()
  let passar = await User.findById('648689b0316798868667d033')
  response.status(200).send(`<h3>${passar}</h3>`)
})

module.exports = router