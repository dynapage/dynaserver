const mongoose = require('mongoose');
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
