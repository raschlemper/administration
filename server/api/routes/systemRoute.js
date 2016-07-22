'use strict'

var config = require('../../config/environment');
var systemController = require(config.resources.controllers + '/systemController');
var express = require('express');
var router = express.Router();

/**
 * /api/system
 */

router.get('/', systemController.findAll);

router.get('/:id', systemController.findById);

router.post('/', systemController.save);

router.put('/:id', systemController.update);

router.delete('/:id', systemController.remove);

module.exports = router;
