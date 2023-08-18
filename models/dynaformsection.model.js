const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;
const DynaFormColumn = require('./dynaformcolumn.model');

const dynaFormSectionSchema = mongoose.Schema(
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
    properties: {
      type: Object,
    },
    columns: [DynaFormColumn.schema],
  },
  { versionKey: false, timestamps: true }
);

/**
 * @typedef DynaFormSection
 */
const DynaFormSection = mongoose.model('appforms.section', dynaFormSectionSchema);

module.exports = DynaFormSection;
