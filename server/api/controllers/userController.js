'use strict';

var config = require('../../config/environment');
var userService = require(config.resources.services + '/userService');
var User = require(config.resources.models + '/userModel');

module.exports = (function () {
  
  var findAll = function (req, res, next) {
    userService.findAll().then(function (users) {
      res.send(users);
    }, function(err) {
      next(err);
    });
  };

  var findById = function (req, res, next) {
    userService.findById(req.params.id).then(function (user) {
      res.send(user);
    }, function(err) {
      next(err);
    });
  };

  var save = function (req, res, next) {
    userService.save(req.body).then(function (save) {
      res.sendStatus(200);
    }, function(err) {
      next(err);
    });
  };

  var update = function (req, res, next) {
    userService.update(req.params.id, req.body).then(function (update) {
      res.sendStatus(200);
    }, function(err) {
      next(err);
    });
  };

  var remove = function (req, res, next) {
    userService.remove(req.params.id).then(function (del) {
      res.sendStatus(200);
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
