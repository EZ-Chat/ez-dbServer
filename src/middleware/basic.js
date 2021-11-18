'use strict';

const base64 = require('base-64');
const { User } = require('../models');

module.exports = async (req, res, next) => {
  if (!req.headers.authorization) {
    next('No auth header');
  }

  const basicHeaderParts = req.headers.authorization.split(' ');
  const encodedString = basicHeaderParts.pop();
  const decodedString = base64.decode(encodedString);

  const [username, password] = decodedString.split(':');

  try {
    req.userInfo = await User.authenticateBasic(username, password);
    next();
  } catch (error) {
    res.status(403).send('Invalid Login');
  }
};
