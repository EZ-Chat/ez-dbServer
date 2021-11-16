'use strict';

// const { database } = require("./lib/models");
const server = require('./src/server.js');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

server.start(PORT);
