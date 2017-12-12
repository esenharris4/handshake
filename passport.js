exports = module.exports = function (app, passport) {
  var LocalStrategy = require('passport-local').Strategy

  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
    function (req, username, password, done) {
      app.db.models.User.findOne(username, function (err, user) {
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
}
