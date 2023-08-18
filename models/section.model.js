const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { schemaOptions } = require('./modelOptions')

const sectionSchema = new Schema({
  board: {
    type: Schema.Types.ObjectId,
    ref: 'Knbn_board_main',
    required: true
  },
  title: {
    type: String,
    default: ''
  }
}, schemaOptions)


const Section = mongoose.model('Knbn_section_main', sectionSchema);

module.exports = Section;