'use strict'

var mongoose = require('mongoose');
var Promise = require("bluebird");

Promise.promisifyAll(mongoose);
var Schema = mongoose.Schema;

var SystemSchema = new Schema({
  name: String,
  description: String,
  route: String
});

/**
 * Virtuals
 */
SystemSchema
  .virtual('profile')
  .get(function() {
    return {
      'id': this._id,
      'name': this.name,
      'description': this.description,
      'route': this.route
    };
  });

module.exports = mongoose.model('System', SystemSchema);
