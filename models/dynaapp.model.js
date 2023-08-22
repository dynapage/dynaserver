const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;
const DynaDesigner = require('./designer.model');
const DynaTable = require('./dynatable.model');
const DynaForm = require('./dynaform.model');

const dynaappSchema = mongoose.Schema(
  {
    _id: {
      type: ObjectId,
      auto: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sitename: {
      type: String,
      required: true,
    },
    dbname: {
      type: String,
      required: true,
      trim: true,
      lowercase: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: Object,
    },
    position: {
      type: Number,
      default: 0,
    },
    startformid: {
      type: ObjectId,
    },
    startformname: {
      type: String,
    },
    validto: {
      type: String,
    },
    kanban: {
      enabled: {
        type: Boolean,
        default: false,
      },
      teamboard: {
        type: Boolean,
        default: false,
      },
    },

    designers: [DynaDesigner.schema],
    appforms: [DynaForm.schema],
    apptables: [DynaTable.schema],
    referenceObjects: [],
    teams: [
      {
        teamName: {
          type: String,
        },
        accessType: {
          type: Number,
          default: 0,
        },
        users: [
          {
            userId: {
              type: String,
            },
            username: {
              type: String,
            },
            userpwd: {
              type: String,
            },
            _id: {
              type: ObjectId,
              auto: true,
              required: true,
            },
          },
        ],
      },
    ],
  },
  { versionKey: false, timestamps: true }
);

/**
 * @typedef DynaApp
 */
const DynaApp = mongoose.model('application', dynaappSchema);

module.exports = DynaApp;
