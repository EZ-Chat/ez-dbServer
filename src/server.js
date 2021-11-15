'use strict';

const express = require('express');
const server = express();

const logger = require('./middleware/logger.js');

server.use(express.json());
server.use(logger);

module.exports = {
  server,
  start: (port) => {
    server.listen(port, () => {
      console.log(`Server is running on ${port}`);
    });
  },
};
