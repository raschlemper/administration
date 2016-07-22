'use strict'

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
// var deepPopulate = require('mongoose-deep-populate');

var Schema = mongoose.Schema;

var SystemSchema = new Schema({
  name: String,
  description: String
});

// SystemSchema.plugin(deepPopulate);
module.exports = mongoose.model('System', SystemSchema);
