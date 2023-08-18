const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { schemaOptions } = require('./modelOptions')

const taskSchema = new Schema({
  section: {
    type: Schema.Types.ObjectId,
    ref: 'Knbn_section_main',
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  content: {
    type: Schema.Types.Array,
    default: []
  },
  position: {
    type: Number
  },
  assignee: {
    type: Schema.Types.ObjectId,
  },
  //assignee
}, schemaOptions)


const Task = mongoose.model('Knbn_task_main', taskSchema);

module.exports = Task;