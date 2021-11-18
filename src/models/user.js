'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');

const SECRET = process.env.SECRET || 'toes';

const userSchema = new Schema(
  {
    username: { type: String },
    password: { type: String },
    friendCode: { type: String },
    friendsList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    rooms: [String],
  },
  { toJSON: { virtuals: true },
    toObject: {virtuals: true }}
);

userSchema.virtual('token')
.get(function () {
  return jwt.sign({ username: this.username }, SECRET);
});

userSchema.statics.authenticateBasic = async function (username, password) {
  const user = await this.findOne({ username });
  const valid = await bcrypt.compare(password, user.password);
  if (valid) {
    return user;
  }
  throw new Error('Invalid User');
};

userSchema.statics.authenticateToken = async function (token) {
  try {
    const parsedToken = jwt.verify(token, SECRET);
    const user = await this.findOne({ username: parsedToken.username });
    if (user) {
      return user;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const User = model('User', userSchema);

module.exports = User;
