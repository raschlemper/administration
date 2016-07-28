'use strict';

var _ = require('lodash');
var config = require('../../config/environment');
var User = require(config.resources.models + '/userModel');

module.exports = (function () {

  var findAll = function () {
    return User.find({}).exec();
  };

  var findById = function (userId) {
    return User.findById(userId).exec();
  };

  var save = function (user) {
    return User.create(user).exec();
  };

  var update = function (userId, user) {
    return findById(userId).then(function (err, userOld) {
      if (err) return;
      if(!userOld) return;
      var updated = _.merge(userOld, user);
      return User.update(updated);
    });
  };

  var remove = function (userId) {
    return findById(userId).then(function (err, user) {
      if (err) return;
      if(!user) return;
      return user.remove();
    });
  };

  return {
    findAll: findAll,
    findById: findById,
    save: save,
    update: update,
    remove: remove
  }

})();
