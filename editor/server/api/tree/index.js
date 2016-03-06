'use strict';

let express = require('express');
let controller = require('./tree.controller');

let router = express.Router();
router.get('/', controller.index);
router.put('/', controller.save);

module.exports = router;
