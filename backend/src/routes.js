const express = require('express')
const router = express.Router()
const Task = require('../db/model')

router.get('/', async (request, response) => {
  let task = new Task({name: 'nome'})
  await task.save()
  let passar = await Task.find()
  response.status(200).send(`<h1>${passar}</h1>`)
})

module.exports = router