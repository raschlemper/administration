var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var config = require('../config/environment');
var userService = require(config.resources.services + '/userService');
var authService = require('./authService');

exports.local = function (User, config, system) {
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
            var userLogin = user.login;
            if(emailValidation(user)) { return emailError(done); }
            if(passwordValidation(user, password)) { return passwordError(done); }       
            if(systemValidation(userLogin, system)) { return systemError(done); }
            return done(null, createUser(User, userLogin));
          });
        }
    ));
};

exports.google = function (User, config, system) {
  passport.use(
    new GoogleStrategy({
      clientID: config.google.clientID,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      saveOrUpdateUser(User, profile, system, done);
    }
  ));
};

var saveOrUpdateUserGoogle = function(User, profile, system, done) {
  userService.findOne({'google.id': profile.id})
    .then(function(user) { 
      var userLogin = user.login;                  
      if(systemValidation(userLogin, system)) { return systemError(done); }
      saveOrUpdateUser(User, createUserGoogle(User, userLogin, profile), done); 
    }, function(err) {
      return done(err);
    });    
};

var saveOrUpdateUser = function(User, userProfile, done) { 
  if (!user) { saveUser(User, userProfile, done); } 
  else { updateUser(User, userProfile, done); }
};

var saveUser = function(User, userProfile, done) {
  userService.save(userProfile)
    .then(function (result) {
      return done(null, result);
    }, function(err) {
      return done(err);
    }); 
};

var updateUser = function(User, userProfile, done) {
  userService.update(userProfile._id, userProfile)
    .then(function (result) {
      return done(null, result);
    }, function(err) {
      return done(err);
    }); 
};

var createUser = function(User, user) {
  var user = new User({
    _id: (user && user._id) || null,
    name: user.name,
    email: user.email,
    image: null,
    role: 'user',
    username: user.username,
    provider: 'local'
  });
  return user;
};

var createUserGoogle = function(User, user, profile) {
  var user = new User({
    _id: (user && user._id) || null,
    name: profile.displayName,
    email: profile.emails[0].value,
    image: profile.photos[0].value,
    role: 'user',
    username: profile.username,
    provider: 'google'
  });
  return user;
};

var getCallbackURL = function(url, target) {
    return url + "?target=" + target;
};

/*
 * Validation
 */

var emailValidation = function(user) {
  if (!user) return false;
  return true;
};

var passwordValidation = function(user, password) {
  if (!user.authenticate(password)) return false;
  return true;
};

var systemValidation = function(user, system) {
  if (!authService.systemAuthorized(user.systems, system)) return false;
  return true;
};

/*
 * Error
 */

var emailError = function(done) {
  return done(null, false, 'EMAIL_NOT_REGISTERED'); 
};

var passwordError = function(done) {
  return done(null, false, 'PASSWORD_NOT_CORRECT'); 
};

var systemError= function(done) {
  return done(null, false, 'SYSTEM_NOT_AUTHORIZED'); 
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