const express = require('express')
const router = express.Router()
const User = require('../db/model')
const crypto = require('node:crypto')
const bcrypt = require('bcrypt')
const algorithm = 'aes-256-ctr'

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

router.post('/newuser', async (request, response) => {
  const {name, password} = await request.body
  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await new User({name, password: hashedPassword})
  //await user.save()
  response.status(200).send(`<h3>${'foi'}</h3>`)
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