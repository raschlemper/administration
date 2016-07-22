'use strict';

var express = require('express');
var path = require('path');
var logger = require('morgan');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var config = require('./environment');

module.exports = function (app) {

  /**
   * View Engine Setup
   */
  app.set('views', config.root + 'client/partials');
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');

  /**
   * Genneral Setup
   */
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
  app.use(methodOverride());
  app.use(cookieParser());

  /**
   * Environment Setup
   */
  var env = app.get('env');

  if ('production' === env) {
    app.use(favicon(path.join(config.root, 'client/dist/img/favicon.png')));
    app.use(express.static(path.join(config.root, 'client/dist')));
    app.set('appPath', config.root + 'client/dist');
    app.use(logger('dev'));
  }

  if ('development' === env || 'test' === env) {
    app.use(favicon(path.join(config.root, 'client/img/favicon.png')));
    app.use(express.static(path.join(config.root, 'client')));
    app.set('appPath', path.join(config.root, 'client'));
    app.use(logger('dev'));
  }
};
