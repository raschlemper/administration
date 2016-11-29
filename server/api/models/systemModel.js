'use strict'

var mongoose = require('mongoose');
var Promise = require("bluebird");
Promise.promisifyAll(mongoose);
// var deepPopulate = require('mongoose-deep-populate');

var Schema = mongoose.Schema;

var SystemSchema = new Schema({
  name: String,
  description: String,
  route: String
});

/**
 * Virtuals
 */
UserSchema
  .virtual('description')
  .get(function() {
    return {
      'id': this._id,
      'description': this.description,
      'route':this.route
    };
  });

// SystemSchema.plugin(deepPopulate);
module.exports = mongoose.model('System', SystemSchema);
