const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;
// const DynaColumn = require('./dynacolumn.model');

const dynaGridColumnSchema = mongoose.Schema(
  {
    _id: {
      type: ObjectId,
      auto: true,
    },
    type: {
      type: Number,
    },
    italic: {
      type: Boolean,
    },
    shapevalue: {
      type: String,
    },

    textalign: {
      type: String,
    },
    valuefield: {
      type: String,
    },
    multiline: {
      type: Boolean,
    },
    texttype: {
      type: Number,
    },
    required: {
      type: Boolean,
    },
    validation: {
      type: Boolean,
    },
    tablecolumn: {
      type: Boolean,
    },

    width: {
      type: Number,
    },
    editable: {
      type: Boolean,
    },
    label: {
      type: String,
    },
    datarefid: {
      type: String,
    },
    dataref: {
      type: String,
    },
    datafield: [],
    formattype: {
      type: Number,
    },
    defaultvalue: {
      type: String,
    },
    fieldsymbol: {
      type: String,
    },
    relatedreflookup: {
      type: String,
    },
    relatedrefcolumn: {
      type: String,
    },
    graphical: {},
    gridtofilter: {},
    redirectto: {},
    popupform: {
      type: Boolean,
    },
  },
  { versionKey: false, timestamps: true }
);

/**
 * @typedef DynaGridColumn
 */
const DynaGridColumn = mongoose.model('appforms.sections.columns.shapes.gridcol', dynaGridColumnSchema);

module.exports = DynaGridColumn;
