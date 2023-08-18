const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;

const dynaColumnSchema = mongoose.Schema(
  {
    _id: {
      type: ObjectId,
      auto: true,
    },
    value: {
      type: String,
    },
    type: {
      type: Number,
    },
    shapevalue: {
      type: String,
    },
    label: {
      type: String,
    },

    checked: {
      type: Boolean,
      default: false,
    },
  
    editable: {
      type: Boolean,
      default: false,
    },
    type: {
      type: Number,
      default: 2,
    },
    tablecolumn: {
      type: Boolean,
      default: true,
    },
    texttype: {
      type: Number,
      default: 1,
    },
    multiline: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
    },
    required: {
      type: Boolean,
      default: false,
    },
    validation: {
      type: Boolean,
      default: false,
    },
    errormessage: {
      type: String,
    },
    dataref: {
      type: String,
    },
    datarefid: {
      type: String,
    },
    valuefield: {
      type: String,
      default: '',
    },
    fieldtoshow: {
      type: String,
      default: '',
    },
    fieldsymbol: {
      type: String,
    },
    link: {
      type: String,
      default: '',
    },
    linkmode: {
      type: Number,
      default: 0,
    },
    dataorderid: {
      type: Number,
      default: 1,
    },
    relatedreflookup: {
      type: String,
    },
    relatedrefcolumn: {
      type: String,
    },
    tablerefobject: {},
    deleted: {
      type: Boolean,
      default: false,
    },
    fieldcondition: {},
    defaultvalue: {},
    datafield: [],
  },
  { versionKey: false, timestamps: true }
);

/**
 * @typedef DynaColumn
 */
const DynaColumn = mongoose.model('apptables.column', dynaColumnSchema);

module.exports = DynaColumn;
