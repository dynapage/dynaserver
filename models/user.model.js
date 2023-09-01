const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const { schemaOptions } = require('./modelOptions');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    usersite: {
      type: String,
      trim: true,
    },
    appid: {
      type: ObjectId,
    },
    teamid: {
      type: ObjectId,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    createdDate: {
      type: Date,
      default: new Date(),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  schemaOptions
);

module.exports = mongoose.model('User', userSchema);
