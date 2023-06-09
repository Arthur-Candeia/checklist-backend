const mongoose = require('mongoose')
mongoose.Promise = global.Promise

mongoose.connect('', {useNewUrlParser: true, useUnifiedTopology: true}).then(console.log('Conectado ao mongoDB Atlas')).catch(err => {
  console.log(err)
})