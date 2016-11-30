'use strict';

var config = require('../../config/environment');
var repository = require(config.resources.repositories + '/systemRepository');

module.exports = (function () {

  var findAll = function () {
    return repository.findAll().then(function(results) {
      return results.map(function(system) {
        return system.profile;
      });       
    });
  };

  var findById = function (id) {
    return repository.findById(id).then(function(result) {
      if(!result) return;
      return result.profile;
    });
  };

  var findOne = function (param) {
    return repository.findOne(param).then(function(result) {
      if(!result) return;
      return result.profile;
    });
  };

  var save = function (system) {
    return repository.save(system);
  };

  var update = function (id, system) {
    return repository.update(system);
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
