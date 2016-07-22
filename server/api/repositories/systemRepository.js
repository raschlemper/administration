'use strict';

var _ = require('lodash');
var config = require('../../config/environment');
var System = require(config.resources.models + '/systemModel');

module.exports = (function () {

  var findAll = function () {
    return System.find({}).exec();
  };

  var findById = function (systemId) {
    return System.findById(systemId);
  };

  var save = function (system) {
    return system.save();
  };

  var update = function(systemId, system) {
    return System.findById(systemId, function (err, systemOld) {
      if (err) return;
      if(!systemOld) return;
      var updated = _.merge(systemOld, system);
      return updated.save();
    });
  };

  var remove = function (systemId) {
    System.findById(systemId, function (err, system) {
      if (err) return;
      if(!system) return;
      return system.remove();
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
