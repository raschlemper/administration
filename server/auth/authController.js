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
      res.json({profile: user.profile, token: token});
    })(req, res, next);
  }

  var google = function(req, res, next) {    
    passport.authenticate('google', { scope : ['profile', 'email'] });
  }

  var googleCallback = function(req, res, next) {
    passport.authenticate('google', function (err, user, info) {
      var error = err || info;
      if (error) return res.json(401, error);
      if (!user) return res.json(404, {message: 'Something went wrong, please try again.'});
      console.log(user);
      var token = authService.signToken(user.profile);
      res.json({profile: user.profile, token: token});
    })(req, res, next);
  }
    
  var isAuthenticated = function (req, res, next) {
    try {
      console.log(req.headers.authorization);
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
