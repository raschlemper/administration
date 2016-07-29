'use strict';

var config = require('../config/environment');
var authService = require('./authService');
var User = require(config.resources.models + '/userModel');

module.exports = (function () {
  
  var isAuthenticated = function (req, res, next) {
    authService.isAuthenticated().then(function (systems) {
      res.sendStatus(200);
    }, function(err) {
      res.sendStatus(401);
    });
  };

  
  return {
    isAuthenticated: isAuthenticated
  };

})();
