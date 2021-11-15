'use strict';

const { Schema, model } = require('mongoose');

module.exports = model(
  'User',
  new Schema({
    userName: { type: String },
    password: { type: String },
    macAddress: { type: String },
  })
);
