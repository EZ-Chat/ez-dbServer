'use strict';

const express = require('express');
const server = express();

const logger = require('./middleware/logger.js');
const routes = require('./router.js');

server.use(express.json());
server.use(logger);

server.use('/', routes);

module.exports = {
  server,
  start: (port) => {
    server.listen(port, () => {
      console.log(`Server is running on ${port}`);
    });
  },
};
