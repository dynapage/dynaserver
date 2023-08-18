const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;
const dynaGridColumnSchema = require('./dynagridcolumn.model');

const dynaFormShapeSchema = mongoose.Schema(
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
    shapevalue: {
      type: String,
    },

    fontsize: {
      type: Number,
    },
    italic: {
      type: Boolean,
    },
    textalign: {
      type: String,
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
    tabindex: {
      type: Number,
    },
    font: {
      type: String,
    },
    texttype: {
      type: Number,
      default: 1,
    },
    maximumlength: {
      type: Number,
    },
    multiline: {
      type: Boolean,
    },
    active: {
      type: Boolean,
    },
    fontbold: {
      type: Boolean,
    },
    required: {
      type: Boolean,
    },
    validation: {
      type: Boolean,
    },
    editable: {
      type: Boolean,
    },
    popupform: {
      type: Boolean,
    },
    hasnew: {
      type: Boolean,
    },
    hasdelete: {
      type: Boolean,
    },
    paged: {
      type: Boolean,
    },
    perpage: {
      type: Number,
    },
    retainvalue: {
      type: Boolean,
    },
    layout: {
      type: Number,
    },
    hastickbox: {
      type: Boolean,
    },
    grid: {
      type: String,
    },
    errormessage: {
      type: String,
    },
    dataref: {
      type: String,
      default: '',
    },
    datarefid: {
      type: String,
    },
    relatedreflookup: {
      type: String,
    },
    relatedrefcolumn: {
      type: String,
    },
    defaultvalue: {
      type: String,
    },
    fieldtoshow: {
      type: String,
    },
    valuefield: {
      type: String,
      default: '',
    },
    dataorderid: {
      type: Number,
    },
    deleted: {
      type: Boolean,
    },
    checktype: {
      type: String,
    },
    redirectto: {
      type: String,
    },
    parentcol: {
      type: String,
    },
    checked: {
      type: Boolean,
    },
    modifieduser: {
      type: Boolean,
    },
    modifiedteam: {
      type: Boolean,
    },
    modifieddate: {
      type: Boolean,
    },
    numberformat: {
      type: Number,
    },
    datafield: {},
    fieldcondition: {},
    customcols: {},
    filters: {},
    cascade: {},
    gridcols: [dynaGridColumnSchema.schema],
  },
  { versionKey: false, timestamps: true }
);

/**
 * @typedef DynaFormShape
 */
const DynaFormShape = mongoose.model('appforms.sections.columns.shape', dynaFormShapeSchema);

module.exports = DynaFormShape;
