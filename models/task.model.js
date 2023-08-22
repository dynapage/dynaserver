const mongoose = require('mongoose');
const { schemaOptions } = require('./modelOptions');

const { Schema } = mongoose;

const taskSchema = new Schema(
  {
    section: {
      type: Schema.Types.ObjectId,
      ref: 'Knbn_section_main',
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
    content: {
      type: Schema.Types.Array,
      default: [],
    },
    position: {
      type: Number,
    },
    assignee: {
      type: Schema.Types.ObjectId,
    },
  },
  schemaOptions
);

const Task = mongoose.model('Knbn_task_main', taskSchema);

module.exports = Task;
