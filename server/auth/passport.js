var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var config = require('../config/environment');
var userService = require(config.resources.services + '/userService');

exports.local = function (User, config) {
    passport.use(
        new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        }, 
        function(email, password, done) {
            User.findOne({
                email: email.toLowerCase()
            }, function(err, user) {
                if (err) return done(err);
                if (!user) { 
                    return done(null, false, { message: 'This email is not registered.' }); 
                }
                if (!user.authenticate(password)) { 
                    return done(null, false, { message: 'This password is not correct.' }); 
                }
                return done(null, user);
            });
        }
    ));
};

exports.google = function (User, config) {
  passport.use(
    new GoogleStrategy({
      clientID: config.google.clientID,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      userService.findOne({'google.id': profile.id})
        .then(function(user) {
          if (!user) {
            console.log('create', user);
            user = createUser(User, profile);
            userService.save(user)
              .then(function (result) {
                return done(null, user);
              }, function(err) {
                return done(err);
              });
          } else {
            console.log('update', user);
            userService.update(user._id, user)
              .then(function (result) {
                return done(null, user);
              }, function(err) {
                return done(err);
              });
          }
        }, function(err) {
          return done(err);
        });
    }
  ));
};

// exports.facebook = function (User, config) {
//   passport.use(new FacebookStrategy({
//       clientID: config.facebook.clientID,
//       clientSecret: config.facebook.clientSecret,
//       callbackURL: config.facebook.callbackURL
//     },
//     function(accessToken, refreshToken, profile, done) {
//       User.findOne({
//         'facebook.id': profile.id
//       },
//       function(err, user) {
//         if (err) {
//           return done(err);
//         }
//         if (!user) {
//           user = new User({
//             name: profile.displayName,
//             email: profile.emails[0].value,
//             role: 'user',
//             username: profile.username,
//             provider: 'facebook',
//             facebook: profile._json
//           });
//           user.save(function(err) {
//             if (err) done(err);
//             return done(err, user);
//           });
//         } else {
//           return done(err, user);
//         }
//       })
//     }
//   ));
// };

// exports.twitter = function (User, config) {
//   passport.use(new TwitterStrategy({
//     consumerKey: config.twitter.clientID,
//     consumerSecret: config.twitter.clientSecret,
//     callbackURL: config.twitter.callbackURL
//   },
//   function(token, tokenSecret, profile, done) {
//     User.findOne({
//       'twitter.id_str': profile.id
//     }, function(err, user) {
//       if (err) {
//         return done(err);
//       }
//       if (!user) {
//         user = new User({
//           name: profile.displayName,
//           username: profile.username,
//           role: 'user',
//           provider: 'twitter',
//           twitter: profile._json
//         });
//         user.save(function(err) {
//           if (err) return done(err);
//           return done(err, user);
//         });
//       } else {
//         return done(err, user);
//       }
//     });
//     }
//   ));
// };

var createUser = function(User, profile) {
  return new User({
    name: profile.displayName,
    email: profile.emails[0].value,
    image: profile.image.url,
    role: 'user',
    username: profile.username,
    provider: 'google',
    google: profile._json
  });
};

var getCallbackURL = function(url, target) {
    return url + "?target=" + target;
};