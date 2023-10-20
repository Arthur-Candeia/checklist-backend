const User = require('../../db/model')
const { verify } = require('jsonwebtoken')

async function middlewareGetToken(request, response, next) {
  try {
    const token = request.headers.authorization?.replace(/^Bearer /, '');
    const {secret} = request.body
    if (!token) return response.status(401).json({msg: 'Você não possui token'})
    const user = await verifyToken(token, secret)
    console.log(user)
    if (!user) return response.status(404).json({msg: 'Usuário não encontrado'})
    response.locals.info = {id: user.id}
    next()
  } catch (err) {
    response.status(500).json({msg: 'Erro na obtenção de token'})
  }
}

async function verifyToken(token, secret) {
  try {
    const decodedToken = verify(token, secret)
    const user = await User.findOne({_id: decodedToken.id}, '-password')
    return user
  } catch (err) {
    return null
  }
}

module.exports = middlewareGetToken