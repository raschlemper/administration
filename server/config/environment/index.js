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
  port: process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
  ip: process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
  secrets: 'supersecret',

  facebook: {
    clientID:     process.env.FACEBOOK_ID || 'id',
    clientSecret: process.env.FACEBOOK_SECRET || 'secret',
    callbackURL:  'https://ras-administration.herokuapp.com/auth/login/facebook/callback'
  },

  twitter: {
    clientID:     process.env.TWITTER_ID || 'id',
    clientSecret: process.env.TWITTER_SECRET || 'secret',
    callbackURL:  'https://ras-administration.herokuapp.com/auth/login/twitter/callback'
  },

  google: {
    clientID:     "317866055004-q70qjlt86mu46jkscrqmj1ctpnn4kacv.apps.googleusercontent.com" || 'id',
    clientSecret: "5_J4UF22rf8aQy_t7pjlZ3Zb" || 'secret',
    callbackURL:  'https://ras-administration.herokuapp.com/auth/callback/google'
  }
};

module.exports = _.merge(config, require('./' + process.env.NODE_ENV + '.js') || {});
