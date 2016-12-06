'use strict';

var config = require('../config/environment');
var passport = require('passport');
var authService = require('./authService');
var User = require(config.resources.models + '/userModel');
var passportConfig = require('./passport');

module.exports = (function () {

  var local = function(req, res, next) {
    passportConfig.local(User, config, getSystem(req));
    passportCallback('local', req, res, next);
  }

  var google = function(req, res, next) {
    passportConfig.google(User, config, getSystem(req));
    passport.authenticate('google', {
      failureRedirect: getTarget(req) || config.google.callbackURL,
      scope: ['https://www.googleapis.com/auth/plus.login',
              'https://www.googleapis.com/auth/plus.profile.emails.read'],
      session: false,
      state: req.query.target
    })(req, res, next);
  }

  var googleCallback = function(req, res, next) {
    req.query.target = req.query.state;
    passportCallback('google', req, res, next); 
  }

  var passportCallback = function(strategy, req, res, next) {
    console.log('>>>>>>>>>>>>>>>>>>> SYSTEM >>> ',getSystem(req));
    passport.authenticate(strategy, function (err, user, info) {
      var error = err || (!info || isEmpty(info) ? null : info); 
      if (error) return res.redirect(getTarget(req) + '?error=' + error);
      if (!user) return res.redirect(getTarget(req) + '?error=' + 'APPLICATION_INCORRECT');
      var token = authService.signToken(user.profile, getSystem(req));
      next(token);
    })(req, res, next);    
  };

  var redirect = function(token, req, res, next) {    
    res.redirect(getTarget(req) + '?token=' + token);
  };
    
  var isAuthenticated = function (req, res, next) {
    try {
      var token = getToken(req);
      var decoded = authService.isAuthenticated(token);
      console.log(decoded);
      if(!authService.systemAuthorized(decoded.user, decoded.system)) {
        res.status(401).send('SYSTEM_NOT_AUTHORIZED');
      } else {
        res.send(decoded.user);         
      }
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
  };

  var getTarget = function(req) {
    if(req.query && req.query.target) {
      return req.query.target;
    }    
  };

  var getSystem = function(req) {
    if(req.params && req.params.system) {
      return req.params.system;  
    }
  };

  var isEmpty = function(obj) {
    return Object.keys(obj).length === 0;
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
