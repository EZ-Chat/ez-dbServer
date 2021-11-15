'use strict';

const express = require('express');
const router = express.Router();
const { people, cars } = require('./models');

const Collection = require('./models/Collections.js');

const modelMap = {
  people: new Collection(people),
  cars: new Collection(cars),
};

router.use('/:model', (req, res, next) => {
  const model = modelMap[req.params.model];
  if (!model) {
    next('No model found');
  }
  req.model = model;
  next();
});

router.post('/:model', async (req, res) => {
  const model = req.model;
  const json = req.body;
  const newRecord = await model.create(json);
  res.send(newRecord);
});

router.get('/:model', async (req, res) => {
  const model = req.model;
  const records = await model.read();
  res.send(records);
});

router.get('/:model/:id', async (req, res) => {
  const model = req.model;
  const id = req.params.id;
  const record = await model.read(id);
  res.send(record);
});

router.put('/:model/:id', async (req, res) => {
  const model = req.model;
  const id = req.params.id;
  const recordToChange = await model.findByPk(id);
  const record = await recordToChange.update(req.body);
  res.send(record);
});

router.delete('/:model/:id', async (req, res) => {
  const model = req.model;
  const id = req.params.id;
  const deletedRows = await model.delete(id);
  res.send(deletedRows);
});

module.exports = router;
