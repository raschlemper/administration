'use strict';

var _ = require('lodash');
var config = require('../../config/environment');
var System = require(config.resources.models + '/systemModel');

module.exports = (function () {

  var findAll = function () {
    return System.findAsync().then(function(results) {
      return results.map(function(system) {
        return system.profile;
      });       
    });
  };

  var findById = function (systemId) {
    return System.findByIdAsync(systemId).then(function(result) {
      return result.profile;
    });
  };

  var findOne = function (params) {
    return System.findOneAsync(params).then(function(result) {
      return result.profile;
    });
  };

  var save = function (system) {
    return System.createAsync(system);
  };

  var update = function(systemId, system) {
    return System.findByIdAndUpdateAsync(systemId, system);
  };

  var remove = function (systemId) {
    return System.findByIdAndRemoveAsync(userId);
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
