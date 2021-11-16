'use strict';

const express = require('express');
const router = express.Router();

const basicAuth = require('./middleware/basic.js');
const bearerAuth = require('./middleware/bearer.js');
const { signup, signin, update, remove } = require('./models/routes.js');

router.post('/signup', signup);
router.post('/signin', basicAuth, signin);
router.put('/user/:id', bearerAuth, update);
router.delete('/user/:id', bearerAuth, remove);

module.exports = router;
