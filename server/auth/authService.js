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

  var signToken = function (user, system) {
    return jwt.sign({ user: user, system: system }, config.secrets, { expiresInMinutes: 60*5 });
  };

  var decodeToken = function (token) {
    try {
      return jwt.decode(token, config.secrets);     
    } catch(err) {
      throw new TokenError(err.message);
    }
  };

  var setTokenCookie = function (req, res) {
    if (!req.user) {
      return res.status(404).send('Something went wrong, please try again.');
    }
    var token = signToken(req.user._id, req.user.role);
    res.cookie('token', token);
    res.redirect('/');
  };  

  var systemAuthorized = function(user, systemId) {
    var authorized = false;
    user.systems.map(function(system) {
      if(system.id === systemId) { authorized = true; }
    });
    return authorized;
  };

  return { 
    isAuthenticated: isAuthenticated,
    signToken: signToken,
    decodeToken: decodeToken,
    systemAuthorized: systemAuthorized
  };

})();