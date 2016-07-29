'use strict';

var config = require('../config/environment');
var passport = require('passport');
var authService = require('./authService');
var User = require(config.resources.models + '/userModel');

module.exports = (function () {

  var local = function(req, res, next) {
    passport.authenticate('local', function (err, user, info) {
      var error = err || info;
      if (error) return res.json(401, error);
      if (!user) return res.json(404, {message: 'Something went wrong, please try again.'});
      var token = authService.signToken(user.profile);
      res.json({token: token});
    })(req, res, next)
  }

  var google = function(req, res, next) {
    return passport.authenticate('google', {
      failureRedirect: '/signup',
      scope: ['https://www.googleapis.com/auth/plus.login',
              'https://www.googleapis.com/auth/plus.profile.emails.read'],
      session: false
    });
  }

  var googleCallback = function(req, res, next) {
    console.log('teste');
    return passport.authenticate('google', {
      successRedirect : '/api/user/',
      failureRedirect : '/'
    });
  }
    
  var isAuthenticated = function (req, res, next) {
    try {
      if(req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = 'Bearer ' + req.query.access_token;
      }
      var token = req.headers.authorization;
      var decoded = authService.isAuthenticated(token);
      res.sendStatus(200); 
    } catch (err) {
      res.status(401).send(err);
    }
  };
  
  return {
    local: local,
    google: google,
    googleCallback: googleCallback,
    isAuthenticated: isAuthenticated
  };

})();