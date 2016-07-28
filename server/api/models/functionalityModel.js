'use strict'

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
// var deepPopulate = require('mongoose-deep-populate');

var Schema = mongoose.Schema;

var FunctionalitySchema = new Schema({
  name: String,
  description: String
});

// FunctionalitySchema.plugin(deepPopulate);
module.exports = mongoose.model('Functionality', FunctionalitySchema);
