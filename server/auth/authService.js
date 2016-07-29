'use strict';

var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/environment');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var compose = require('composable-middleware');
var User = require(config.resources.models + '/userModel');
var validateJwt = expressJwt({ secret: config.secrets });

module.exports = (function () {

  var isAuthenticated = function () {
    if(req.query && req.query.hasOwnProperty('access_token')) {
      req.headers.authorization = 'Bearer ' + req.query.access_token;
    }
    validateJwt(req, res, next);
  };

  var signToken = function(user) {
    return jwt.sign({ user: user }, config.secrets, { expiresInMinutes: 60*5 });
  };

  return { 
    isAuthenticated: isAuthenticated,
    signToken: signToken
  };

})();