'use strict';

var config = require('../config/environment');
var jwt = require('jsonwebtoken');
var TokenError = require(config.resources.errors + "/TokenError" );

module.exports = (function () {

  var isAuthenticated = function (token) {
    try {
      return jwt.verify(token, config.secrets);     
    } catch(err) {
      throw new TokenError(err.message);
    }
  };

  var signToken = function (user) {
    return jwt.sign({ user: user }, config.secrets, { expiresInMinutes: 60*5 });
  };

  var setTokenCookie = function (req, res) {
    if (!req.user) {
      return res.status(404).send('Something went wrong, please try again.');
    }
    var token = signToken(req.user._id, req.user.role);
    res.cookie('token', token);
    res.redirect('/');
  }

  return { 
    isAuthenticated: isAuthenticated,
    signToken: signToken
  };

})();