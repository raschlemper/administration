'use strict';

var config = require('../../config/environment');
var repository = require(config.resources.repositories + '/systemRepository');

module.exports = (function () {

  var findAll = function () {
    return repository.findAll();
  };

  var findById = function (id) {
    return repository.findById(id);
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
    save: save,
    update: update,
    remove: remove
  }

})();
