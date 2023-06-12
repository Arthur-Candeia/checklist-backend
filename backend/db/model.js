const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const userSchema = mongoose.Schema({
  name: {type: String, required: true},
  password: {type: String, required: true},
  tasks: [
    {
      content: {type: String, required: true},
      done: {type: Boolean, default: false},
      iv: {type: Buffer, required: true}
    }
  ]
})

module.exports = mongoose.model('User', userSchema)