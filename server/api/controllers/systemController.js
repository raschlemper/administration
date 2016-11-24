'use strict';

var config = require('../../config/environment');
var systemService = require(config.resources.services + '/systemService');
var System = require(config.resources.models + '/systemModel');

module.exports = (function () {
  
  var findAll = function (req, res, next) {
    systemService.findAll().then(function (systems) {
      res.send(systems);
    }, function(err) {
      next(err);
    });
  };

  var findById = function (req, res, next) {
    systemService.findById(req.params.id).then(function (system) {
      res.send(system);
    }, function(err) {
      next(err);
    });
  };

  var save = function (req, res, next) {
    systemService.save(req.body).then(function (save) {
      res.send(200);
    }, function(err) {
      next(err);
    });
  };

  var update = function (req, res, next) {
    systemService.update(req.params.id, req.body).then(function (update) {
      res.status(200);
    }, function(err) {
      next(err);
    });
  };

  var remove = function (req, res, next) {
    systemService.remove(req.params.id).then(function (del) {
      res.send(200);
    }, function(err) {
      next(err);
    });
  };

  
  return {
    findAll: findAll,
    findById: findById,
    save: save,
    update: update,
    remove: remove
  };

})();
