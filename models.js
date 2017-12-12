'user strict'

exports = module.exports = function (app, mongoose) {
  require('./models/users')(app, mongoose)
}
