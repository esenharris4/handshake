var express = require('express')
var router = express.Router()
var debug = require('debug')('index')
var passport = require('passport')
var pug = require('pug')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
})

router.post('/', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) { return next(err) }
    if (!user) { return res.redirect('error') }
    req.login(user, function(err) {
        if (err) {
            next(err);
        }
    })
    return res.render('home', {email: req.user._id})
  })(req, res, next)
})

router.post('/createUser', function (req, res, next) {
  debug(req.app.db)
  req.app.db.models.User.encryptPassword(req.body.password, function (err, hash) {
  	console.log(req.body.password);
    if (err) {
      debug(err)
      return res.render('error', {message: err})
    }
    var fields = {
      _id: req.body.email,
      password: hash
    }
    req.app.db.models.User.create(fields, function (err, user) {
      if (err) {
        debug(err)
        return res.render('error', {message: err})
      }
    })
  })
  return res.redirect('/')
})

module.exports = router
