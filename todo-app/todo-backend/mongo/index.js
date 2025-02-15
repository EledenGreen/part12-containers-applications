const mongoose = require('mongoose')
const Todo = require('./models/Todo')
const { MONGO_URL } = require('../util/config')

if (MONGO_URL && !mongoose.connection.readyState) {
  mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log('connected to ', MONGO_URL)
} else {
  console.log(`not connected ${MONGO_URL}`)
}

module.exports = {
  Todo,
}
