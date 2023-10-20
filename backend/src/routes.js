const express = require('express')
const router = express.Router()
const User = require('../db/model')
require('dotenv').config()

const crypto = require('node:crypto')
const {encripted, decipher} = require('./common/crypto')
const bcrypt = require('bcrypt')
const setToken = require('./common/setToken')
const middlewareGetToken = require('./common/middlewareGetToken')

router.get('/', async (request, response) => {
  response.status(307).redirect('https://checklist-fullstack-arthur-candeia.vercel.app/')
})

router.post('/', async (request, response) => {
  try {
    const {name, password} = await request.body
    const user = await User.findOne({name})

    if (await bcrypt.compare(password, user.password)) {
      const key = (String(user._id) + String(user._id)).slice(0, 22) + process.env.TASK
      await user.tasks.forEach((element) => element.content = decipher(key, element.content, element.iv))
      
      response.status(200).json({tasks: user.tasks, name: user.name, ...await setToken(user._id)})
    }
    else {
      response.status(404).json({err: 'Usuário não encontrado ou senha incorreta'})
    }
  }
  catch {
    response.status(404).json({err: 'Usuário não encontrado ou senha incorreta'})
  }
})

router.post('/login', middlewareGetToken, async (request, response) => {
  try {
    const {content} = await request.body
    const {id} = response.locals.info
    const user = await User.findById(id, '-password')
    const key = (String(user._id) + String(user._id)).slice(0, 22) + process.env.TASK
    const iv = Buffer.from(crypto.randomBytes(16))
    const contentEncripted = encripted(key, content, iv)

    await user.tasks.push({content: contentEncripted, iv: iv})
    await user.save()
    response.status(200).json('{}')
  } catch (err) {
    response.status(500).json({err: 'Não foi possível salvar a task'})
  }
})

router.post('/newuser', async (request, response) => {
  try {
    const {name, password} = await request.body

    const allUsers = await User.find()
    const verify = allUsers.filter((element) => element.name == name)
    if (verify.length == 0) {
      const hashedPassword = await bcrypt.hash(password, 10)
      const user = await new User({name, password: hashedPassword})
      await user.save()
      response.status(201).json('{}')
    }
    else {
      response.status(422).json({err: 'Usuário já existente'})
    }
  }
  catch {
    response.status(500).json(`${{err: 'Não foi possível criar um novo usuário'}}`)
  }
})

router.put('/login', middlewareGetToken, async (request, response) => {
  try {
    const {index, content} = await request.body
    const {id} = response.locals.info
    const user = await User.findById(id, '-password')
    const key = (String(user._id) + String(user._id)).slice(0, 22) + process.env.TASK
    
    const contentEncripted = encripted(key, content, user.tasks[index].iv)
    user.tasks[index].content = contentEncripted
    await user.save()
    response.status(200).json('{}')
  }
  catch {
    response.status(500).json({err: 'Não foi possível alterar a task'})
  }
})

router.put('/login/done/:index/:condition', middlewareGetToken, async (request, response) => {
  try {
    const {id} = response.locals.info
    const user = await User.findById(id, '-password')
    user.tasks[request.params.index].done = request.params.condition == 'true' ? true : false
    await user.save()
    response.status(200).json('{}')
  }
  catch {
    response.status(500).json({err: 'Não foi possível alterar o estado da task'})
  }
})

router.delete('/login/:index', middlewareGetToken, async (request, response) => {
  try {
    const {id} = response.locals.info
    const user = await User.findById(id, '-password')
    user.tasks.splice(request.params.index, 1)
    await user.save()
    response.status(200).json('{}')
  }
  catch {
    response.status(500).json({err: 'Não foi possível alterar a task'})
  }
})

module.exports = router