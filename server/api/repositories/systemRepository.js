'use strict';

var _ = require('lodash');
var config = require('../../config/environment');
var System = require(config.resources.models + '/systemModel');

module.exports = (function () {

  var findAll = function () {
    return System.findAsync({}).exec();
  };

  var findById = function (systemId) {
    console.log(System.findByIdAsync(systemId));
    return System.findById(systemId);
  };

  var save = function (system) {
    return system.saveAsync();
  };

  var update = function(systemId, system) {
    return System.findByIdAsync(systemId, function (err, systemOld) {
      if (err) return;
      if(!systemOld) return;
      var updated = _.merge(systemOld, system);
      return updated.saveAsync();
    });
  };

  var remove = function (systemId) {
    System.findByIdAsync(systemId, function (err, system) {
      if (err) return;
      if(!system) return;
      return system.removeAsync();
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
