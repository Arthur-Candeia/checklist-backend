const express = require('express')
const router = express.Router()
const User = require('../db/model')
const crypto = require('node:crypto')
const bcrypt = require('bcrypt')
require('dotenv').config()

router.get('/', async (request, response) => {
  //let user = new User({name: 'nome', password: '1234', tasks: {content: 'conteúdo'}})
  //await user.save()
  let user = await User.find()
  response.status(200).send(`<h3>${user}</h3>`)
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

/*
router.get('/login/:id', async (request, response) => {
  try {
    const user = await User.findById(request.params.id)

    
  }
  catch {
    response.status(500).json(`${{err: 'Usuário não identificado no banco de dados'}}`)
  }
})
*/

router.post('/login/:id/:content', async (request, response) => {
  try {
    const user = await User.findById(request.params.id)
    const key = (String(user._id) + String(user._id)).slice(0, 22) + process.env.TASK
    const iv = Buffer.from(crypto.randomBytes(16))

    const contentEncripted = encripted(key, request.params.content, iv)
    await user.tasks.push({content: contentEncripted, iv: iv})
    await user.save()
    //response.status(200).redirect(`/login/${request.params.id}`)
  } catch (err) {
    response.status(500).json(`${{err: 'Não foi possível salvar a task'}}`)
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
    }
    else {
      response.status(422).json({err: 'Usuário já existente'})
    }
  }
  catch {
    response.status(500).json(`${{err: 'Não foi possível criar um novo usuário'}}`)
  }
  //response.status(200).redirect(`/`)
})

router.put('/login/:user/:id/:content', async (request, response) => {
  try {
    const user = await User.findById(request.params.user)
    let position;
    const key = (String(user._id) + String(user._id)).slice(0, 22) + process.env.TASK
    const contentEncripted = encripted(key, request.params.content, user.tasks[position].iv)
    for (let i = 0; i < user.tasks.length; i++) {
      if (user.tasks[i]._id == request.params.id) {
        position = i;
      }
    }

    user.tasks[position].content = contentEncripted
    await user.save()
    //response.status(200).redirect(`/`)
  }
  catch {
    response.status(500).json({err: 'Não foi possível alterar a task'})
  }
})

router.delete('/remove/:id', async (request, response) => {
  await User.findByIdAndRemomve(request.params.id)
  //response.status(200).redirect(`/`)
})

/*
  const {name, password} = await request.body
  let user = await new User({name})
  const key = (String(user._id) + String(user._id)).slice(0, 32)
  const iv = Buffer.from(crypto.randomBytes(16))
  const EncriptedPassword = encripted(key, password, iv)

  user._doc = {...user._doc, password: EncriptedPassword, iv: iv}
  const teste = decipher(key, EncriptedPassword, user._doc.iv)
  console.log(user._doc.iv, teste)
*/
//const task = await user.tasks.forEach((element) => {if(element._id == request.params.id) return user.tasks.indexOf(element)})

function encripted(key, content, iv) {
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(key), iv)
  let encrypted = cipher.update(content)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return encrypted.toString('hex')
}

function decipher(key, content, iv) {
  iv = Buffer.from(iv, 'hex')
  content = Buffer.from(content, 'hex')
  let cipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(key), iv)
  let contentDecipher = cipher.update(content)
  return contentDecipher.toString('utf-8')
}

module.exports = router