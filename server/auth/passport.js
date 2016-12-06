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
            if (!user) { 
                return done(null, false, 'EMAIL_NOT_REGISTERED'); 
            }
            if (!user.authenticate(password)) { 
                return done(null, false, 'PASSWORD_NOT_CORRECT'); 
            }                
            if (!authService.systemAuthorized(user.profile, system)) { 
                return done(null, false, 'SYSTEM_NOT_AUTHORIZED'); 
            }
            var userProfile = createUser(User, user.profile);
            setId(userProfile, user);
            setSystem(userProfile, user);
            return done(null, userProfile);
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
      if (!authService.systemAuthorized(user, system)) { 
          return done(null, false, 'SYSTEM_NOT_AUTHORIZED'); 
      }
      var userProfile = callbackCreateUser(User, profile);
      setId(userProfile, user);
      setSystem(userProfile, user.profile); 
      saveOrUpdateUser(User, userProfile, done, createUserGoogle); 
    }, function(err) {
      return done(err);
    });    
};

var saveOrUpdateUser = function(User, userProfile, done, callbackCreateUser) { 
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

var createUser = function(User, profile) {
  var user = new User({
    name: profile.name,
    email: profile.email,
    image: null,
    role: 'user',
    username: profile.username,
    provider: 'local'
  });
  return user;
};

var createUserGoogle = function(User, profile) {
  var user = new User({
    name: profile.displayName,
    email: profile.emails[0].value,
    image: profile.photos[0].value,
    role: 'user',
    username: profile.username,
    provider: 'google'
  });
  return user;
};

var setId = function(profile, user) {
  var id = (user && user._id) || null;
  profile._id = id;
};

var setSystem = function(profile, user) {
  profile.systems = [];
  user.systems.map(function(system) {
    profile.systems.push({ _id: system._id });
  });
};

var getCallbackURL = function(url, target) {
    return url + "?target=" + target;
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