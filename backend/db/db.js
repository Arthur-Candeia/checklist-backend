const mongoose = require('mongoose')
require('dotenv').config()
mongoose.Promise = global.Promise

mongoose.connect(`mongodb+srv://${process.env.CADASTRO}:${process.env.ENTRADA}@cluster.cpygyot.mongodb.net/?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true}).then(console.log('Conectado ao mongoDB Atlas')).catch(err => {
  console.log(err)
})