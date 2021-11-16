'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Schema, model } = require('mongoose');

const SECRET = process.env.SECRET || 'toes';

// const userSchema = () => {
const userModel = model(
  'User',
  new Schema({
    userName: { type: String },
    password: { type: String },
    rooms: [String],
    token: {
      type: DataTypes.VIRTUAL,
      get() {
        return jwt.sign({ username: this.username }, SECRET);
      },
    },
  })
);

userModel.beforeCreate(async (user) => {
  let hashedPass = await bcrypt.hash(user.password, 10);
  user.password = hashedPass;
});

userModel.authenticateBasic = async function (username, password) {
  const user = await this.findOne({ username }).exec();
  const valid = await bcrypt.compare(password, user.password);
  if (valid) {
    return user;
  }
  throw new Error('Invalid User');
};

userModel.authenticateToken = async function (token) {
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

// return userModel;
// };

module.exports = userModel;
