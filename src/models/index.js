'use strict';

require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const personModel = require('./person.js.js');
const carModel = require('./car.js.js');

const DATABASE_URL = process.env.DATABASE_URL || 'sqlite:memory';

const options =
  process.env.NODE_ENV === 'production'
    ? {
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
      }
    : {};

const sequelizeInstance = new Sequelize(DATABASE_URL, options);

const personTable = personModel(sequelizeInstance, DataTypes);
const carTable = carModel(sequelizeInstance, DataTypes);

module.exports = {
  database: sequelizeInstance,
  people: personTable,
  cars: carTable,
};
