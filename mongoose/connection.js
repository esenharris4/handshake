var mongoose = require('mongoose')
var debug = require('debug')('mongoose:connection')

const uri = ('mongodb://localhost:27017/mongoose')

module.exports = mongoose.createConnection(uri, function (err) {
  if (err) {
    debug('Error!' + err)
    throw new Error('No mongodb available: ' + err)
  } else {
    debug('Connection created')
  }
})
