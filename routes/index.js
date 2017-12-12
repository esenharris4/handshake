var express = require('express')
var router = express.Router()
// var debug = require('debug')('index')
var passport = require('passport')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
})

router.get('/home', function (req, res, next) {
  return res.render('home')
})
router.post('/', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) { return next(err) }
    if (!user) { return res.redirect('error') }
    return res.redirect('/home')
  })(req, res, next)
})

// router.post('/', function (req, res, next) {
//   debug(req.app.db)
//   req.app.db.models.User.encryptPassword(req.body.password, function (err, hash) {
//     if (err) {
//       debug(err)
//       return res.render('error', {message: err})
//     }
//     var fields = {
//       email: req.body.email,
//       password: hash
//     }
//     req.app.db.models.User.create(fields, function (err, user) {
//       if (err) {
//         debug(err)
//         return res.render('error', {message: err})
//       }
//     })
//   })
// })
//
// router.post('/', function (req, res, next) {
//   passport.authenticate
// }

module.exports = router
