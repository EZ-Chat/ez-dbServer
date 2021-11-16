'use strict';

const { user } = require('./user.js');

module.exports = {
  signup: async (req, res, next) => {
    try {
      let userRecord = await user.create(req.body);
      const output = {
        user: userRecord,
        token: userRecord.token,
      };
      res.status(201).json(output);
    } catch (error) {
      next(error.message);
    }
  },

  signin: (req, res, next) => {
    const user = {
      userInfo: req.userInfo,
      token: requserInfo.token,
    };
    res.status(200).json(user);
  },

  update: async (req, res) => {
    try {
      const updatedRecord = await this.model.findOneAndUpdate(req.params.id, req.body);
      res.status(200).send(updatedRecord);
    } catch (error) {
      res.status(500).send(error);
    }
  },

  remove: async (req, res) => {
    try {
      const deletedRows = await this.model.deleteOne(req.params.id);
      res.status(200).send(deletedRows);
    } catch (error) {
      res.status(500).send(error);
    }
  },
};
