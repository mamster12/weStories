const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys');

//load user model
// //require user model
const User = require('../models/User');

module.exports = function (passport) {
  passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback',
    proxy: true
  },
    (accessToken, refreshToken, profile, done) => {
      const image = profile.photos[0].value;

      const newUser = {
        googleID: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        image: image
      }
      User.findOne({
        googleID: profile.id
      }).then(user => {
        if (user) {
          done(null, user);
        }
        else {
          new User(newUser)
            .save()
            .then(user => {
              done(null, user)
            });
        }
      })

      //  console.log(accessToken);
      //  console.log(profile);
    }
  ));
  // Used to stuff a piece of information into a cookie
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Used to decode the received cookie and persist session
  passport.deserializeUser((id, done) => {
    User.findById(id)
    .then(user => done(null, user));
  });
}