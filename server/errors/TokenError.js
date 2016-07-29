'use strict';

var util = require( "util" );

module.exports = function TokenError(message) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.type = "Authenticate";
  this.message = util.format("Unauthorized (%s)", message);
  this.errorCode = 401;
}