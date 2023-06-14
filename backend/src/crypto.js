const crypto = require('node:crypto')

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

module.exports = {encripted, decipher}