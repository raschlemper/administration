var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var config = require('../config/environment');
var userService = require(config.resources.services + '/userService');

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
                    return done(null, false, { message: 'EMAIL_NOT_REGISTERED' }); 
                }
                if (!user.authenticate(password)) { 
                    return done(null, false, { message: 'PASSWORD_NOT_CORRECT' }); 
                }
                return done(null, user);
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
      saveOrUpdateUser(User, profile, system, done, createUser);
    }
  ));
};

var saveOrUpdateUser = function(User, profile, system, done, callbackCreateUser) {
  userService.findOne({'google.id': profile.id})
    .then(function(user) {
      var userProfile = callbackCreateUser(User, profile);
      setId(userProfile, user);
      setSystem(userProfile, system);
      if (!user) { saveUser(User, userProfile, done, callbackCreateUser); } 
      else { updateUser(User, userProfile, done, callbackCreateUser); }  
    }, function(err) {
      return done(err);
    });    
};

var saveUser = function(User, userProfile, done, callbackCreateUser) {
  userService.save(userProfile)
    .then(function (result) {
      console.log(result);
      return done(null, result);
    }, function(err) {
      return done(err);
    }); 
};

var updateUser = function(User, userProfile, done, callbackCreateUser) {
  userService.update(userProfile._id, userProfile)
    .then(function (result) {
      console.log(result);
      return done(null, result);
    }, function(err) {
      return done(err);
    }); 
};

var createUser = function(User, profile) {
  var user = new User({
    _id: id,
    name: profile.displayName,
    email: profile.emails[0].value,
    image: profile.photos[0].value,
    role: 'user',
    username: profile.username,
    provider: 'google',
    google: profile._json
  });
  return user;
};

var setId = function(profile, user) {
  var id = (user && user._id) || null;
  profile._id = id;
};

var setSystem = function(profile, system) {
  if(profile.systems) { profile.systems = []; }
  profile.systems.push(system.toString());
};

var getCallbackURL = function(url, target) {
    return url + "?target=" + target;
};

var systemAuthorized = function(user, systemId) {
  var authorized = false;
  user.systems.map(function(system) {
    if(system.id === systemId) { authorized = true; }
  });
  return authorized;
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