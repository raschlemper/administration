'use strict';

var express = require('express');
var config = require('../config/environment');
var router = express.Router();
var controller = require('./authController');
// var User = require(config.resources.models + '/userModel');

// Passport Configuration
// require('./passport').local(User, config);
// require('./passport').facebook(User, config);
// // require('./passport').twitter(User, config);
// require('./passport').google(User, config);

router.get('/authenticated/:system', controller.isAuthenticated);
router.get('/token/user', controller.getUser);

// router.post('/local', controller.local);
// router.post('/facebook', controller.facebook);
// router.post('/twitter', controller.twitter);
// router.get('/google', controller.google);

router.post('/login/local/:system', controller.local, controller.redirect);
router.get('/login/google/:system', controller.google);
router.get('/callback/google', controller.googleCallback, controller.redirect);

module.exports = router;