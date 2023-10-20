const { sign } = require('jsonwebtoken')
const { v4 } = require('uuid')

async function setToken(id) {
  const secret = v4()
  const token = sign({id}, `${secret}`, {expiresIn: '3h'})
  return {token, secret}
}

module.exports = setToken