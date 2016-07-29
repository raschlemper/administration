'use strict';

var _ = require('lodash');
var config = require('../../config/environment');
var User = require(config.resources.models + '/userModel');

module.exports = (function () {

  var findAll = function () {
    return User.findAsync().then(function(results) {
      return results.map(function(user) {
        return user.profile;
      });       
    });
  };

  var findById = function (userId) {
    return User.findByIdAsync(userId).then(function(results) {
      return user.profile;
    });
  };

  var save = function (user) {
    return User.createAsync(user);
  };

  var update = function (userId, user) {
    return User.findByIdAndUpdateAsync(userId, user);
  };

  var remove = function (userId) {
    return User.findByIdAndRemoveAsync(userId);
  };

  return {
    findAll: findAll,
    findById: findById,
    save: save,
    update: update,
    remove: remove
  }

})();
