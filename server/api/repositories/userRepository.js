'use strict';

var _ = require('lodash');
var config = require('../../config/environment');
var User = require(config.resources.models + '/userModel');

module.exports = (function () {

  var findAll = function () {
    return User.findAsync({});
  };

  var findById = function (userId) {
    return User.findByIdAsync(userId);
  };

  var save = function (user) {
    return User.createAsync(user);
  };

  var update = function (userId, user) {
    return User.findByIdAsync(userId).then(function (result) {
      console.log(result);
      if(!result) return;
      var updated = _.merge(result, user);
      return updated.saveAsync(updated)
        .spread(function(updated) {
          return updated;
        });
    });
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
