'use strict';

var path = require('path');
var _ = require('lodash');

// All Generics Configurations
// ============================================
var config = {
  env: process.env.NODE_ENV || 'development',
  root: path.normalize(__dirname + '/../../../'),
  resources: {
    routes: path.normalize(__dirname + '/../../../server/api/routes'),
    controllers: path.normalize(__dirname + '/../../../server/api/controllers'),
    services: path.normalize(__dirname + '/../../../server/api/services'),
    repositories: path.normalize(__dirname + '/../../../server/api/repositories'),
    models: path.normalize(__dirname + '/../../../server/api/models'),
    auth: path.normalize(__dirname + '/../../../server/auth'),
    errors: path.normalize(__dirname + '/../../../server/errors')
  },
  ip: process.env.IP || '127.0.0.1',
  port: process.env.PORT || 3000,
  secrets: 'supersecret'
};

module.exports = _.merge(config, require('./' + process.env.NODE_ENV + '.js') || {});
