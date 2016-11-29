'use strict';

var config = require('../config/environment');
var passport = require('passport');
var authService = require('./authService');
var User = require(config.resources.models + '/userModel');

module.exports = (function () {

  var local = function(req, res, next) {
    passportCallback('local', req, res, next);
  }

  var google = function(req, res, next) {
    passport.authenticate('google', {
      failureRedirect: '/api/user',
      scope: ['https://www.googleapis.com/auth/plus.login',
              'https://www.googleapis.com/auth/plus.profile.emails.read'],
      session: false
    })(req, res, next);
  }

  var googleCallback = function(req, res, next) {
    passportCallback('google', req, res, next);
  }

  var passportCallback = function(strategy, req, res, next) {
    console.log(strategy, req.params, req.query);
    passport.authenticate(strategy, function (err, user, info) {
      var error = err || info;
      if (error) return res.json(401, error);
      if (!user) return res.json(404, {message: 'Something went wrong, please try again.'});
      next(user);
    })(req, res, next);    
  }

  var redirect = function(user, req, res, next) {
    console.log(req.params, req.query);
    var token = authService.signToken(user.profile);
    if(req.query && req.query.target) {
      res.redirect(req.query.target + '?token=' + token)
    }
  }
    
  var isAuthenticated = function (req, res, next) {
    try {
      var token = getToken(req);
      var decoded = authService.isAuthenticated(token);
      res.send(decoded.user); 
    } catch (err) {
      res.status(401).send(err);
    }
  };
    
  var getUser = function (req, res, next) {
    try {
      var token = getToken(req);
      var decoded = authService.decodeToken(token);
      res.send(decoded.user); 
    } catch (err) {
      res.status(401).send(err);
    }
  };

  var getToken = function(req) {
      if(req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = 'Bearer ' + req.query.access_token;
      }
      return req.headers.authorization;    
  }
  
  return {
    local: local,
    google: google,
    googleCallback: googleCallback,
    redirect: redirect,
    isAuthenticated: isAuthenticated,
    getUser: getUser
  };

})();
