'use strict';

var config = require('../../config/environment');
var repository = require(config.resources.repositories + '/userRepository');

module.exports = (function () {

  var findAll = function () {
    return repository.findAll().then(function(results) {
      return results.map(function(user) {
        return user.profile;
      });       
    });
  };

  var findById = function (id) {
    return repository.findById(id).then(function(result) {
      return result.profile;
    });
  };

  var findOne = function (param) {
    return repository.findOne(param).then(function(result) {
      return result.profile;
    });
  };

  var findOneGoogle = function (param) {
    return repository.findOne(param).then(function(result) {
      return result.profileGoogle;
    });
  };

  var save = function (user) {
    // user.systems = convertLisObjectId(user.systems);
    return repository.save(user);
  };

  var update = function (id, user) {
    // user.systems = convertLisObjectId(user.systems);
    return repository.update(id, user);
  };

  var remove = function (id) {
    return repository.remove(id);
  };

  var convertLisObjectId = function(list, field) {
    console.log(list.length);
    if(!list) return;
    var listReturn = [];
    list.map(function(object) {
      var ObjectId = convertObjectId(object, field);
      if(ObjectId) { listReturn.push(ObjectId); }
    });
    return listReturn;
  };

  var convertObjectId = function(object, field) {
    if(!object[field]) return;
    return ObjectId(object[field]);
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
