var Models = require('./models');
var flash = require('connect-flash');

exports = module.exports = function (app, passport) {
  var LocalStrategy = require('passport-local').Strategy

  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
    function (req, username, password, done) {
      Models.User.findOne(conditions, function (err, user) {
        if (err) {
          return done(err)
        }

        if (!user) {
          return done(null, false, req.flash('LoginMessage', {'error': 'Unknown User'}))
        }

        // Create a password salt
        var salt = bcrypt.genSaltSync(10);

        // Salt and hash password
        var hashed = bcrypt.hashSync(req.body.password, salt);

        Models.User.validatePassword(hashed, user.password, function (err, isValid) {
          if (err) {
            return done(err)
          }

          if (!isValid) {
            return done(null, false, req.flash('LoginMessage', {'error': 'Invalid password'}))
          }

          return done(null, user)
        })
      })
    }
  ))

  passport.serializeUser(function (user, done) {
    done(null, user._id)
  })

  passport.deserializeUser(function (id, done) {
    Models.User.findOne({ _id: id }).exec(function (err, user) {
      done(err, user)
    })
  })
}
