'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const SECRET = process.env.SECRET || 'toes';

const userSchema = new Schema({
  username: { type: String },
  password: { type: String },
  friendCode: { type: String },
  friendsList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  rooms: [String],
});

userSchema.virtual('token').get(() => {
  return jwt.sign({ username: this.username }, SECRET);
});

userSchema.pre('save', async function (next) {
  const hashedPass = await bcrypt.hash(this.password, 10);
  this.password = hashedPass;
  this.friendCode = uuidv4();
  next();
});

userSchema.methods.authenticateBasic = async function (username, password) {
  const user = await this.findOne({ username }).exec();
  const valid = await bcrypt.compare(password, user.password);
  if (valid) {
    return user;
  }
  throw new Error('Invalid User');
};

userSchema.methods.authenticateToken = async function (token) {
  try {
    const parsedToken = jwt.verify(token, SECRET);
    const user = await this.findOne({ username: parsedToken.username }).exec();
    if (user) {
      return user;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const User = model('User', userSchema);

module.exports = User;
