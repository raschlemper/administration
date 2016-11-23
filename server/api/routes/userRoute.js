'use strict'

var config = require('../../config/environment');
var userController = require(config.resources.controllers + '/userController');
var express = require('express');
var router = express.Router();

/**
 * /api/user
 */

router.get('/profile', userController.profile);
router.get('/', userController.findAll);
router.get('/:id', userController.findById);
router.post('/', userController.save);
router.put('/:id', userController.update);
router.delete('/:id', userController.remove);

module.exports = router;
