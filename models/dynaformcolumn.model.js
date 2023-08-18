const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;
const dynaFormShapeSchema = require('./dynaformshape.model');

const dynaFormColumnSchema = mongoose.Schema(
  {
    _id: {
      type: ObjectId,
      auto: true,
    },
    position: {
      type: Number,
    },
    type: {
      type: Number,
    },
    label: {
      type: String,
    },
    shapes: [dynaFormShapeSchema.schema],
  },
  { versionKey: false, timestamps: true }
);

/**
 * @typedef DynaFormColumn
 */
const DynaFormColumn = mongoose.model('appforms.sections.column', dynaFormColumnSchema);

module.exports = DynaFormColumn;
