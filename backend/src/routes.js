const express = require('express')
const router = express.Router()
const User = require('../db/model')
const crypto = require('node:crypto')
const {encripted, decipher} = require('./crypto')
const bcrypt = require('bcrypt')
require('dotenv').config()

router.get('/', async (request, response) => {
  response.status(307).redirect('https://checklist-fullstack-arthur-candeia.vercel.app/')
})

router.post('/', async (request, response) => {
  try {
    const {name, password} = await request.body
    const user = await User.findOne({name})

    if (await bcrypt.compare(password, user.password)) {
      const key = (String(user._id) + String(user._id)).slice(0, 22) + process.env.TASK
      const tasks = user.tasks.map((element) => decipher(key, element.content, element.iv))
      response.status(200).json({tasks})
      //response.status(200).redirect(`/login/${String(user._id)}`)
    }
    else {
      response.status(404).json({err: 'Usuário não encontrado ou senha incorreta'})
    }
  }
  catch {
    response.status(404).json({err: 'Usuário não encontrado ou senha incorreta'})
  }
})

router.post('/login/:id/:content', async (request, response) => {
  try {
    const user = await User.findById(request.params.id)
    const key = (String(user._id) + String(user._id)).slice(0, 22) + process.env.TASK
    const iv = Buffer.from(crypto.randomBytes(16))
    const contentEncripted = encripted(key, request.params.content, iv)

    await user.tasks.push({content: contentEncripted, iv: iv})
    await user.save()
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
      response.status(201).redirect('/')
    }
    else {
      response.status(422).json({err: 'Usuário já existente'})
    }
  }
  catch {
    response.status(500).json(`${{err: 'Não foi possível criar um novo usuário'}}`)
  }
})

router.put('/login/:user/:id/:content', async (request, response) => {
  try {
    const user = await User.findById(request.params.user)
    let position;
    const key = (String(user._id) + String(user._id)).slice(0, 22) + process.env.TASK
    for (let i = 0; i < user.tasks.length; i++) {
      if (user.tasks[i]._id == request.params.id) {
        position = i;
      }
    }
    
    const contentEncripted = encripted(key, request.params.content, user.tasks[position].iv)
    if (position != undefined) {
      user.tasks[position].content = contentEncripted
      await user.save()
    }
  }
  catch {
    response.status(500).json({err: 'Não foi possível alterar a task'})
  }
})

router.delete('/login/:user/:id', async (request, response) => {
  try {
    const user = await User.findById(request.params.user)
    let position;
    for (let i = 0; i < user.tasks.length; i++) {
      if (user.tasks[i]._id == request.params.id) {
        position = i;
      }
    }

    if (position != undefined) {
      user.tasks.splice(position, 1)
      await user.save()
    }
  }
  catch {
    response.status(500).json({err: 'Não foi possível alterar a task'})
  }
})

module.exports = router