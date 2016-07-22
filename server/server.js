'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

/**
 * Server Configs
 */
var app = express();
var server = require('http').createServer(app);

require('./config/express')(app);
require('./routes')(app);

server.listen(config.port, config.ip, function () {
	console.log('Admin listening on http://%s:%d, in %s mode', config.ip, config.port, app.get('env'));
});

exports = module.exports = app;