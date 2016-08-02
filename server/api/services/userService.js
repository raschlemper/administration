'use strict';

var config = require('../../config/environment');
var repository = require(config.resources.repositories + '/userRepository');

module.exports = (function () {

  var findAll = function () {
    return repository.findAll();
  };

  var findById = function (id) {
    return repository.findById(id);
  };

  var findOne = function (param) {
    return repository.findOne(param);
  };

  var save = function (user) {
    return repository.save(user);
  };

  var update = function (id, user) {
    return repository.update(id, user);
  };

  var remove = function (id) {
    return repository.remove(id);
  };

  return {
    findAll: findAll,
    findById: findById,
    findOne: findOne,
    save: save,
    update: update,
    remove: remove
  }

})();
