'use strict';

var _ = require('lodash');
var config = require('../../config/environment');
var System = require(config.resources.models + '/systemModel');

module.exports = (function () {

  var findAll = function () {
    return System.findAsync();
  };

  var findById = function (systemId) {
    return System.findByIdAsync(systemId);
  };

  var findOne = function (params) {
    return System.findOneAsync(params);
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
