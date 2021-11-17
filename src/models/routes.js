'use strict';

const { User } = require('../models');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

module.exports = {
  signup: async (req, res, next) => {
    const { username, password, rooms } = req.body;
    try {
      const user = await User.findOne({ username });
      if (user) {
        res.status(400).json({ message: 'User already exists' });
      } else {
        const hashedPass = await bcrypt.hash(password, 10);
        const userRecord = new User({
          username,
          password: hashedPass,
          rooms,
          friendCode: uuidv4(),
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
      token: req.token,
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

  addFriend: async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.userInfo._id });
      const friend = await User.findOne({ friendCode });
      const roomKey = uuidv4();
      user.friendsList.push({
        friend,
      });
      user.rooms.push(roomKey);
      friend.rooms.push(roomKey);
      await friend.save();
      const savedUser = await user.save();
      res.status(200).send(savedUser);
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
