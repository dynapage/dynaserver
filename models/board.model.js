const mongoose = require('mongoose');
const { schemaOptions } = require('./modelOptions');

const { Schema } = mongoose;

const boardSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    team: [
      {
        type: Schema.Types.ObjectId,
        ref: 'application.teams',
      },
    ],
    icon: {
      type: String,
      default: '📃',
    },
    title: {
      type: String,
      default: 'Untitled',
    },
    description: {
      type: String,
      default: `Add description here
    🟢 You can add multiline description
    🟢 Let's start...`,
    },
    position: {
      type: Number,
    },
    favourite: {
      type: Boolean,
      default: false,
    },
    favouritePosition: {
      type: Number,
      default: 0,
    },
  },
  schemaOptions
);

const Board = mongoose.model('Knbn_board_main', boardSchema);

module.exports = Board;
