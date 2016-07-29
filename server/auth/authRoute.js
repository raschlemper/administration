'use strict';

var express = require('express');
var config = require('../config/environment');
var router = express.Router();
var controller = require('./authController');
var User = require(config.resources.models + '/userModel');

// Passport Configuration
require('./local/passport').setup(User, config);
// require('./facebook/passport').setup(User, config);
// require('./google/passport').setup(User, config);
// require('./twitter/passport').setup(User, config);

router.use('/local', require('./local'));
// router.use('/facebook', require('./facebook'));
// router.use('/twitter', require('./twitter'));
// router.use('/google', require('./google'));

router.get('/valide', controller.isAuthenticated);

module.exports = router;