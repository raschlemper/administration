'use strict';

let util = require( 'util' );

module.exports = function DataError(message) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.type = 'Data';
  this.message = util.format('Data invalid (%s)', message);
}

util.inherits( module.exports, Error );
