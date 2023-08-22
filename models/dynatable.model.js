const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;
const DynaColumn = require('./dynacolumn.model');

const dynaTableSchema = mongoose.Schema(
  {
    _id: {
      type: ObjectId,
      required: true,
      auto: true,
    },
    name: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
    type: {
      type: Number,
      default: 1,
    },
    teams: [
      { team1: { type: String, default: 'team1' }, accessid: { type: Number, default: 1 } },
      { team2: { type: String, default: 'team2' }, accessid: { type: Number, default: 1 } },
      { team3: { type: String, default: 'team3' }, accessid: { type: Number, default: 1 } },
      { team4: { type: String, default: 'team4' }, accessid: { type: Number, default: 1 } },
    ],
    columns: [DynaColumn.schema],
  },
  { versionKey: false, timestamps: true }
);

/**
 * @typedef DynaTable
 */
const DynaTable = mongoose.model('applications.apptable', dynaTableSchema);

module.exports = DynaTable;
