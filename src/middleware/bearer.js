'use strict';

const { user } = require('../models/user.js');

module.exports = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      next('Invalid Login');
    }

    const token = req.headers.authorization.split(' ').pop();
    const validUser = await user.authenticateToken(token);

    req.userInfo = validUser;
    req.token = validUser.token;
    next();
  } catch (error) {
    res.status(403).send('Invalid Login');
  }
};
