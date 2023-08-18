const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;
const DynaFormSection = require('./dynaformsection.model');

const dynaFormSchema = mongoose.Schema(
  {
    _id: {
      type: ObjectId,
      auto: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    position: {
      type: Number,
    },
    label: {
      type: String,
    },
    formDataRef: {
      type: String,
    },
    formSchemaRef: {
      type: ObjectId,
    },
    formSchemaRefID: {
      type: String,
    },
    homepagemenu: {
      type: Boolean,
    },
    displayMode: {
      type: Number,
    },
    t1: {
      type: Boolean,
    },
    t2: {
      type: Boolean,
    },
    t3: {
      type: Boolean,
    },
    t4: {
      type: Boolean,
    },
    t5: {
      type: Boolean,
    },
    showteamdata: {
      type: Boolean,
      default: false,
    },
    showuserdata: {
      type: Boolean,
      default: false,
    },
    formula: { type: Object },
    sections: [DynaFormSection.schema],
  },
  { versionKey: false, timestamps: true }
);

/**
 * @typedef DynaForm
 */
const DynaForm = mongoose.model('applications.appform', dynaFormSchema);

module.exports = DynaForm;
