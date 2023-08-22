const mongoose = require('mongoose');
const { schemaOptions } = require('./modelOptions');

const { Schema } = mongoose;

const sectionSchema = new Schema(
  {
    board: {
      type: Schema.Types.ObjectId,
      ref: 'Knbn_board_main',
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
    position: {
      type: Number,
    },
  },
  schemaOptions
);

const Section = mongoose.model('Knbn_section_main', sectionSchema);

module.exports = Section;
