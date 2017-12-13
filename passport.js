var debug = require('debug')('passport')
exports = module.exports = function (app, passport) {
  var LocalStrategy = require('passport-local').Strategy

  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
    function (req, username, password, done) {
      var conditions = { _id: username }
      debug('hello')
      // console.log(app.db.models.User)
      app.db.models.User.findOne(conditions, function (err, user) {
        if (err) {
          return done(err)
        }

        if (!user) {
          return done(null, false)
        }
        app.db.models.User.validatePassword(password, user.password, function (err, isValid) {
          if (err) {
            return done(err)
          }

          if (!isValid) {
            return done(null, false)
          }

          return done(null, user)
        })
      })
    })
  )

  passport.serializeUser(function(user, done) {
    console.log(user._id)
    done(null,user._id)
  })

  passport.deserializeUser(function(id, done) {
    app.db.models.User.findOne({_id: id}).exec(function(err, user) {
      console.log("deserializing " + user._id)
      done(err, user)
    })
  })

}
