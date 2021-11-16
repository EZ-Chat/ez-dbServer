'use strict';

const { User } = require('../models');

module.exports = {
  signup: async (req, res, next) => {
    const { username, password, rooms } = req.body;
    try {
      const user = await User.findOne({username});
      if(user){
        return res.status(400).JSON({message: 'User already exists'});
      } else {
        const userRecord = new User({
          username,
          password,
          rooms,
        });
        const savedNewUser = await userRecord.save();
        res.status(201).json(savedNewUser);
      }
    } catch (error) {
      next(error.message);
    }
  },

  signin: (req, res) => {
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
