'use strict'

exports = module.exports = function (app, mongoose) {
  var User = new mongoose.Schema({
    _id: String,
    password: String,
    groups: [String],
    emailList: [[String]]
  })

  User.methods.canPlayRoleOf = function (role) {
    if (role === 'admin' && this.roles.admin) {
      return true
    }
    return false
  }
  User.methods.defaultReturnUrl = function () {
    var returnUrl = '/'
    if (this.canRoleOf('admin')) {
      returnUrl = '/admin' + this.roles.admin.toString()
    }
    return returnUrl
  }

  User.statics.encryptPassword = function (password, done) {
    var bcrypt = require('bcrypt')
    bcrypt.genSalt(15, function (err, salt) {
      if (err) {
        return done(err)
      }

      bcrypt.hash(password, salt, function (err, hash) {
        done(err, hash)
      })
    })
  }

  User.statics.validatePassword = function (password, hash, done) {
    var bcrypt = require('bcrypt')
    bcrypt.compare(password, hash, function (err, res) {
      done(err, res)
    })
  }
  app.db.model('User', User)
}
