'use strict';

var config = require('../config/environment');
var passport = require('passport');
var authService = require('./authService');
var User = require(config.resources.models + '/userModel');

module.exports = (function () {

  var login = function(req, res, next) {
    console.log(req.params);
    passportCallback('local', req, res, next);
  }




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
    passport.authenticate(strategy, function (err, user, info) {
      var error = err || info;
      if (error) return res.json(401, error);
      if (!user) return res.json(404, {message: 'Something went wrong, please try again.'});
      next(user);
    })(req, res, next);    
  }

  var redirect = function(user, req, res, next) {
    var token = authService.signToken(user.profile);
    res.redirect('http://ras-treinamento.herokuapp.com/#/auth/token/' + token)
    // res.json({ token: token });
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
    login: login,
    redirect: redirect,
    local: local,
    google: google,
    googleCallback: googleCallback,
    isAuthenticated: isAuthenticated
  };

})();
